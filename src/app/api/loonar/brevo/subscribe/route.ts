import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {

    const requestBody = await req.text();

    let { email } = requestBody
        ? JSON.parse(requestBody)
        : { email:"" };


    const myHeaders = new Headers();
    myHeaders.append("Authorization", "8F39D289C2D21ABA1D95845FF5F26BE1");
    myHeaders.append("Origin", process.env.LOONAR_BASE_URL || "");
    myHeaders.append("Content-Type", "application/json");
    try {
        const fetchRes = await (await fetch(process.env.LOONAR_BE_URL+"/brevo/subscribe", {
            method: "POST",
            headers: myHeaders,
            body:JSON.stringify({
                email: email,
                listIds: [2]
            }),
            redirect: "follow",
            cache: "no-store"
        })).json();
        if(fetchRes?.error){
            if(fetchRes?.error == "Unable to create contact, email is already associated with another Contact"){
                return NextResponse.json({ message: 'Questa email è già iscritta alla newsletter!', status: 500 });
            }else{
                return NextResponse.json({ message: 'Error in /brevo/subscribe. '+fetchRes?.error, status: 500 });
            }

        }else{
            return NextResponse.json({ message: fetchRes, status: 200 });
        }
    }catch (e){
        return NextResponse.json({ message: 'Error in /brevo/subscribe. '+e, status: 500 });
    }





}