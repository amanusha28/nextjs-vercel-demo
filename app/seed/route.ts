// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function GET() {
//   try {
//     const result = await sql.begin((sql) => [
//       // seedUsers(),
//       // seedCustomers(),
//       // seedInvoices(),
//       // seedRevenue(),
//     ]);

//     return Response.json({ message: 'Database seeded successfully' });
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }
