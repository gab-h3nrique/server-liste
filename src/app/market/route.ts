import { Prisma } from "@prisma/client"
import prisma from "../../../db/prisma"

export async function GET(req: Request, res: Response) {

    try {

        
        const { searchParams } = new URL(req.url)
    
        const id = Number(searchParams.get('id') || 0)
        const name = searchParams.get('name') || ''
        const latitude = Number(searchParams.get('latitude') || 0)
        const longitude = Number(searchParams.get('longitude') || 0)

        if(id) return Response.json({ market: await prisma.markets.findUnique({ where: { id: id }}) })
        if(name) return Response.json({ market: await prisma.markets.findMany({ where: { name: { contains: name, mode: 'insensitive' }, }}) })
        
            
        if(!latitude || !longitude) return Response.json({ market: await prisma.markets.findMany() })
    
        const earthRadiusInMeters = 6371e3; // Earth's radius in meters

        const haversineDistance = (startLat: any, startLon: any, endLat: any, endLon: any) => {
        const dLat = (endLat - startLat) * (Math.PI / 180);
        const dLon = (endLon - startLon) * (Math.PI / 180);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(startLat * (Math.PI / 180)) * Math.cos(endLat * (Math.PI / 180)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusInMeters * c;
        };

        const maxDistance = 5; // 5 meters is the desired search radius

        const markets = await prisma.markets.findMany({
        where: {
            AND: [
            { latitude: { gte: latitude - maxDistance / earthRadiusInMeters, lte: latitude + maxDistance / earthRadiusInMeters } },
            { longitude: { gte: longitude - maxDistance / (earthRadiusInMeters * Math.cos(latitude * (Math.PI / 180))), lte: longitude + maxDistance / (earthRadiusInMeters * Math.cos(latitude * (Math.PI / 180))) } },
            ],
        },
        });

        const data = markets.filter(market => haversineDistance(latitude, longitude, market.latitude, market.longitude) <= maxDistance);
      
       
        return new Response( JSON.stringify(data), { status: 200 })


    } catch (e: any) {

        return new Response(String(e), { status: 500 })

    }


}