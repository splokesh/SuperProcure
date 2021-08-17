require("dotenv").config();
const path = require("path");
const XLSX = require("xlsx");
const MongoClient = require("mongodb").MongoClient;

const { hashPassword } = require("./hash-password");

const url = process.env.MONGODB_URL; // Connection URL
const dbName = process.env.DATABASE_NAME;

(async () => {
	const cleanedData = [];
	try {
		const filePath = path.resolve(__dirname, "../docs/BeetleNut_Data.xlsx");

		const workbook = XLSX.readFile(filePath, {
			type: "array",
			cellDates: true,
		});
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const data = XLSX.utils.sheet_to_json(sheet);

		for (const d of data) {
			cleanedData.push({
				instituteName: String(d["Insitution Name"].trim()),
				branchName: String(d["Branch Name"]).trim(),
				address: String(d.Address).trim(),
				city: String(d.City).trim(),
				incharge: String(d["Branch Incharge"]).trim(),
				contact: String(d["Contact Number"]).split(",").filter(e => Boolean(e)).map(e => e.trim()),
				pincode: String(d["Pincode covered"]).replace(/(\r\n|\n|\r)/gm, "").split(",").filter(e => Boolean(e)).map(e => e.trim()),
				password: await hashPassword("BranchInchage"),
				username: String(d["Branch Name"]).trim().toLowerCase(),
			})
		}
	} catch (error) {
		console.log("Error on parsng data", error);
		process.exit();
	} finally {
		console.log("Excel parsing completed")
	}

	const mongoClient = new MongoClient(url, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		sslValidate: false,
	});
	console.log("Mongo connection established");
	try {
		await mongoClient.connect();

		const db = mongoClient.db(dbName);

		await db.collection("Admin").deleteMany({});
		await db.collection("Business").deleteMany({});
		console.log("Old data removed");

		await db.collection("Admin").insertOne({
			name: "Beetle Nut Solutions",
			email: "admin@bns.com",
			password: await hashPassword("Admin@123"),
			type: "ADMIN"
		});
		console.log("Admin Seed Done");

		await db.collection("Business").insertMany(cleanedData);
		console.log("Excel Seed Done!");
	} catch (error) {
		console.log("Seeding error", error);
	} finally {
		mongoClient.close();
		console.log("Mongo Connection closed");
		process.exit();
	}
})();