import { Prisma } from "@prisma/client"
import prisma from "../../../db/prisma"

export async function GET(req: Request, res: Response) {

    try {

        
        const { searchParams } = new URL(req.url)
    
        const id = Number(searchParams.get('id') || 0)
        const name = searchParams.get('name') || ''
        const brand = searchParams.get('brand') || ''
        const tag = searchParams.get('tag') || ''
        const category = searchParams.get('category') || ''

        if(id) return Response.json({ data: await prisma.products.findUnique({ where: { id: id }, include: { prices: true }}) })
    
        const data = await prisma.products.findMany({
            where: {
                name: { contains: name, mode: 'insensitive' },
                brand: { contains: brand, mode: 'insensitive' },
                tags: { contains: tag, mode: 'insensitive' },
                categories: { contains: category, mode: 'insensitive' },
            },
            include: { prices: true }
        })
       
        return new Response( JSON.stringify(data), { status: 200 })


    } catch (e: any) {

        return new Response(String(e), { status: 500 })

    }


}