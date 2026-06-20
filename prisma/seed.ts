import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { config } from "dotenv"

config({ path: ".env.local", override: true })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function findOrCreateUser(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })
  if (data?.user) return data.user

  const { data: listData } = await supabase.auth.admin.listUsers()
  const found = listData?.users.find(u => u.email === email)
  if (found) return found

  throw error
}

async function seed() {
  console.log("Seeding...")

  const adminUser = await findOrCreateUser("admin@clipr.in", "Admin@123", "Admin")
  await prisma.profile.upsert({
    where: { id: adminUser.id },
    update: { name: "Admin", role: "ADMIN", isVerified: true },
    create: {
      id: adminUser.id,
      email: adminUser.email!,
      name: "Admin",
      role: "ADMIN",
      isVerified: true,
    },
  })
  console.log("✓ Admin created")

  const creatorUser = await findOrCreateUser("creator@clipr.in", "Creator@123", "Karan Soni")
  await prisma.profile.upsert({
    where: { id: creatorUser.id },
    update: { name: "Karan Soni", role: "CREATOR", isVerified: true },
    create: {
      id: creatorUser.id,
      email: creatorUser.email!,
      name: "Karan Soni",
      role: "CREATOR",
      isVerified: true,
    },
  })
  await prisma.creatorProfile.upsert({
    where: { userId: creatorUser.id },
    update: { channelName: "Karan Clips", instagramHandle: "@karansoni", followerCount: 5000, isApproved: true },
    create: {
      userId: creatorUser.id,
      channelName: "Karan Clips",
      instagramHandle: "@karansoni",
      followerCount: 5000,
      isApproved: true,
    },
  })
  console.log("✓ Creator created")

  const clipperUser = await findOrCreateUser("clipper@clipr.in", "Clipper@123", "Rahul Sharma")
  await prisma.profile.upsert({
    where: { id: clipperUser.id },
    update: { name: "Rahul Sharma", role: "CLIPPER", upiId: "rahul@paytm", isVerified: true },
    create: {
      id: clipperUser.id,
      email: clipperUser.email!,
      name: "Rahul Sharma",
      role: "CLIPPER",
      upiId: "rahul@paytm",
      isVerified: true,
    },
  })
  console.log("✓ Clipper created")

  const existingCampaign = await prisma.campaign.findFirst()
  if (!existingCampaign) {
    await prisma.campaign.create({
      data: {
        title: "Summer Fashion Campaign",
        description: "Create short clips showcasing our summer collection. Highlight the vibrant colors and lightweight fabrics.",
        sourceVideoUrl: "https://youtube.com/watch?v=example",
        bountyTotal: 50000,
        bountyPerLakhViews: 500,
        platformFee: 2500,
        remainingBounty: 47500,
        status: "ACTIVE",
        allowedPlatforms: ["INSTAGRAM_REELS", "YOUTUBE_SHORTS"],
        minClipDuration: 15,
        maxClipDuration: 60,
        creatorId: creatorUser.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
    console.log("✓ Sample campaign created")
  } else {
    console.log("✓ Campaign already exists")
  }

  console.log("\nSeed complete!")
  await prisma.$disconnect()
}

seed().catch((e) => {
  console.error("Seed error:", e.message)
  process.exit(1)
})
