import { PrismaClient } from "@prisma/client"
import { randomInt } from "crypto"
import fs from "fs/promises"

const prisma = new PrismaClient()

function generateRandomNumbers(): Promise<{ size: number }[]> {
	return new Promise((resolve, reject) => {
		const numbers: { size: number }[] = []

		for (let i = 0; i < 10; i++) {
			const random = Math.random() * (50 - 38) + 38
			const rounded = Math.round(random * 2) / 2 // Round to the nearest 0.5
			numbers.push({
				size: rounded
			})
		}

		const filtered = [...new Set(numbers)]
		resolve(filtered)
	})
}

function getRandomNumber() {
	const weightedNumbers = [1, 2, 3, 4, 5, 5, 5, 5, 5] // Higher weight for 5

	const randomIndex = Math.floor(Math.random() * weightedNumbers.length)
	return weightedNumbers[randomIndex]
}

async function main() {
	const jsonData = await fs.readFile("shoes-data.json", "utf-8")
	const data = JSON.parse(jsonData)

	for (const item of data) {
		const photos: { image_url?: string }[] = []
		if (item.models[0].images.length > 0 && item.price !== "" && item.models[0].label !== "") {
			for (let i = 0; i < item.models[0].images.length; i++) {
				const element = item.models[0].images[i]
				photos.push({
					image_url: element
				})
			}

			const numbers = await generateRandomNumbers()
			await prisma.shoe.create({
				data: {
					description:
						"La chaussure de basket est un équipement essentiel pour les joueurs de ce sport dynamique et exigeant. Conçue spécifiquement pour répondre aux besoins des athlètes sur le terrain, elle allie style, performance et protection. ",
					model: item.name,
					price: 190,
					real_price: parseInt(item.price.split("$")[1]) ?? 400,
					color: item.models[0].colors[0] ?? "Black",
					status: "Available",
					brand: "Jordan",
					rate: getRandomNumber(),
					is_validate: true,
					Photo: {
						create: [...photos]
					},
					size: {
						create: [...numbers]
					}
				}
			})
		}
	}

	console.log("Inserted all items successfully")
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
