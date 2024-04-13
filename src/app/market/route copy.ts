import { Prisma } from "@prisma/client"
import prisma from "../../../db/prisma"

function haversineDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
    const R = 6371; // raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // em km
    return distance;
}

export async function GET(req: Request, res: Response) {

    try {

        
        const { searchParams } = new URL(req.url)
    
        const id = Number(searchParams.get('id') || 0)
        const name = searchParams.get('name') || ''
        const latitude = Number(searchParams.get('latitude') || 0)
        const longitude = Number(searchParams.get('longitude') || 0)

        if(id) return Response.json({ data: await prisma.markets.findUnique({ where: { id: id }}) })
        if(name) return Response.json({ data: await prisma.markets.findMany({ where: { name: { contains: name, mode: 'insensitive' }, }}) })
        
            
        if(!latitude || !longitude) return Response.json({ data: await prisma.markets.findMany() })
    
        const markets = await prisma.markets.findMany();
        const data = markets.filter(market => {
            const distance = haversineDistance(latitude, longitude, market.latitude || 0, market.longitude || 0);
            return distance <= 0.050; // 5 metros em km
        });
       
        return new Response( JSON.stringify(data), { status: 200 })


    } catch (e: any) {

        console.log(e)
        return new Response(String(e), { status: 500 })

    }


}