// Seed script for SPVBS family data.
// Run from the project root: node seed/seed-families.mjs
// Requires .env with SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL, DATABASE_URL.

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import { config } from "dotenv";

config(); // load .env

const prisma = new PrismaClient();
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const DEFAULT_PASSWORD = "spvbs@123";
const DEFAULT_TALUKA = "Aska";

// ---- helpers ----
function slugName(name) {
  return name
    .toLowerCase()
    .replace(/late\.?|sri\.?/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 40);
}

function mapGender(relation) {
  const r = (relation || "").toLowerCase();
  if (["wife", "mother", "daughter", "sister", "sister-in-law", "grandmother", "daughter-in-law"].some((x) => r.includes(x))) return "FEMALE";
  if (["son", "father", "brother", "nephew", "husband", "grandfather"].some((x) => r.includes(x))) return "MALE";
  return null;
}

// Detect HOF gender: female if the family has a Husband member (widow HOF),
// or the HOF's own occupation is House wife.
function detectHofGender(fam) {
  const occ = (fam.hof.occupation || "").toLowerCase();
  if (occ.includes("house wife") || occ.includes("housewife")) return "FEMALE";
  const hasHusband = (fam.members || []).some((m) =>
    (m.relation || "").toLowerCase().includes("husband")
  );
  if (hasHusband) return "FEMALE";
  return "MALE";
}

function mapMarital(status) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.startsWith("married") || s === "m") return "MARRIED";
  if (s.startsWith("unmarried") || s === "u") return "UNMARRIED";
  return null;
}

function mapCurrentStatus(occupation) {
  if (!occupation) return null;
  const o = occupation.toLowerCase();
  if (o.includes("student") || o.includes("study") || o.includes("schooling")) return "STUDYING";
  if (o.includes("house wife") || o.includes("housewife") || o.includes("house") ) return "HOMEMAKER";
  if (o.includes("retired")) return "RETIRED";
  if (o) return "EMPLOYED";
  return null;
}

function parseDate(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  // sanity: reject clearly-wrong future dates
  if (d.getFullYear() > 2025) return null;
  return d;
}

// ---- main ----
async function run() {
  const data = JSON.parse(readFileSync(new URL("./seed/families.json", `file://${process.cwd()}/`), "utf8"));
  const families = data.families;
  console.log(`Seeding ${families.length} families...`);

  let created = 0, skipped = 0, failed = 0;
  const usedEmails = new Set();

  for (const fam of families) {
    const hof = fam.hof;
    // Build a unique email
    let email;
    if (hof.mobile && /^\d{6,}$/.test(hof.mobile.trim())) {
      email = `${hof.mobile.trim()}@spvbs.local`;
    } else {
      email = `${slugName(hof.name)}@spvbs.local`;
    }
    // de-dup emails
    let base = email, n = 1;
    while (usedEmails.has(email)) { email = base.replace("@", `.${n}@`); n++; }
    usedEmails.add(email);

    try {
      // 1. Create auth user (confirmed)
      const { data: createdUser, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: hof.name, role: "FAMILY_HEAD" },
      });
      if (createErr) {
        if (createErr.message && createErr.message.includes("already been registered")) {
          console.log(`  skip (exists): ${email}`);
          skipped++;
          continue;
        }
        throw createErr;
      }
      const authId = createdUser.user.id;

      // 2. User row (APPROVED)
      await prisma.user.upsert({
        where: { id: authId },
        update: { email, status: "APPROVED", role: "FAMILY_HEAD" },
        create: { id: authId, email, role: "FAMILY_HEAD", status: "APPROVED" },
      });

      // 3. Family unit
      const family = await prisma.familyUnit.upsert({
        where: { familyHeadUserId: authId },
        update: {},
        create: {
          familyName: hof.name,
          familyHeadUserId: authId,
          taluka: DEFAULT_TALUKA,
          villageTown: hof.villageTown || DEFAULT_TALUKA,
        },
      });

      // 4. Head member
      await prisma.familyMember.create({
        data: {
          familyUnitId: family.id,
          relation: "Head",
          fullName: hof.name,
          gender: detectHofGender(fam),
          dob: parseDate(hof.dob),
          maritalStatus: mapMarital(hof.maritalStatus),
          qualification: hof.qualification || null,
          occupation: hof.occupation || null,
          currentStatus: mapCurrentStatus(hof.occupation),
          mobileNumber: hof.mobile || null,
          villageTown: hof.villageTown || DEFAULT_TALUKA,
          visibility: "PUBLIC",
        },
      });

      // 5. Other members
      for (const m of fam.members) {
        await prisma.familyMember.create({
          data: {
            familyUnitId: family.id,
            relation: m.relation || "Other",
            fullName: m.name,
            gender: mapGender(m.relation),
            dob: parseDate(m.dob),
            maritalStatus: mapMarital(m.maritalStatus),
            qualification: m.qualification || null,
            occupation: m.occupation || null,
            currentStatus: mapCurrentStatus(m.occupation),
            mobileNumber: null,
            villageTown: m.villageTown || null,
            visibility: "MEMBERS_ONLY",
          },
        });
      }

      created++;
      console.log(`  ✓ ${hof.name}  (${email})  +${fam.members.length} members`);
    } catch (e) {
      failed++;
      console.error(`  ✗ FAILED ${hof.name}: ${e.message}`);
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`);
  await prisma.$disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
