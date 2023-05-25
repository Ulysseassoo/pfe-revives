import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import fs from "fs/promises";

const prisma = new PrismaClient();

async function main() {
	const jsonData = await fs.readFile("shoes-data.json", "utf-8");
	const data = JSON.parse(jsonData);

	for (const item of data) {
		const photos: { image_url?: string }[] = [];
		for (let i = 0; i < item.models[0].images.length; i++) {
			const element = item.models[0].images[i];
			photos.push({
				image_url: element,
			});
		}
		await prisma.shoe.create({
			data: {
				description:
					"La chaussure de basket est un équipement essentiel pour les joueurs de ce sport dynamique et exigeant. Conçue spécifiquement pour répondre aux besoins des athlètes sur le terrain, elle allie style, performance et protection. ",
				model: item.name,
				price: 80,
				real_price: parseInt(item.price.split("$")[1]) ?? 200,
				color: item.models[0].colors[0] ?? "Black",
				size: 40,
				status: "Available",
				brand: "Jordan",
				rate: randomInt(5),
				is_validate: true,
				Photo: {
					create: [...photos],
				},
			},
		});
	}

	console.log("Inserted all items successfully");
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
