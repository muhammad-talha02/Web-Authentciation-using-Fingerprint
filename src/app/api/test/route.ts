export async function GET(){
    return Response.json({success:true, message:"Server is Ready"})
}

export async function POST(request:Request){

    const data = await request.json()
    return new Response(JSON.stringify(data),{
       headers:{
        'Content-Type':"application/json"
       },
       status:201
    })
}