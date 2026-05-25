import {NextRequest, NextResponse} from "next/server";

// API route handler per aggiornare il carrello
export async function POST(req: NextRequest) {

    const requestBody = await req.text();

    let { route, page, search, limit, locale, catId } = requestBody
        ? JSON.parse(requestBody)
        : { route:"", page: 1, search: "", limit: 10, locale: "en", catId: null };

   // locale = locale == "en" ? "en-US" : locale + "-" + locale.toUpperCase();

    locale = ["it-IT"];




    let res = NextResponse.json({ message: 'Invalid item data', status: 400 });

    const myHeaders = new Headers();
    myHeaders.append("Authorization", process.env.LOONAR_PUBLIC_TOKEN || "");

    myHeaders.append("Accept-Language", locale);
    myHeaders.append("Language", locale);



    let url = process.env.LOONAR_BE_URL +"/faq"+route+"?page="+page+"&search="+search+"&limit="+limit;

    if(catId){
        url = process.env.LOONAR_BE_URL + "/faq?categoryIds=["+catId+"]";
    }


    try {
        const fetchRes = await (await fetch(url, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
            cache: "no-store"
        })).json();
        res = NextResponse.json({ message: fetchRes, status: 200 });
    }catch (e){
        res = NextResponse.json({ message: 'Error in /faq/'+route + ". "+e, status: 400 });
    }

    return res;

}