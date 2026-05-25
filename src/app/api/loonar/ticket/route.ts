import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // --- Incoming request debug ---
    //console.log("[POST] Incoming request method:", req.method);
    //console.log("[POST] Incoming request headers:", Object.fromEntries(req.headers.entries()));

    const requestBody = await req.text();

    //console.log("[POST] Raw requestBody type:", typeof requestBody);
    //console.log("[POST] Raw requestBody value:", requestBody);

    let parsedBody: any;
    try {
        parsedBody = requestBody ? JSON.parse(requestBody) : {};
    } catch (err) {
        console.error("[POST] Error parsing JSON body:", err);
        return NextResponse.json({
            message: "Invalid JSON in request body",
            status: 400,
        });
    }

    let { msg, email, data, attachments } = parsedBody || {
        msg: "",
        email: "",
        data: "",
        attachments: "",
    };

    // --- Attachments debug ---
    //console.log("[POST] attachments raw value:", attachments);
    //console.log("[POST] attachments typeof:", typeof attachments);

    if (attachments && typeof attachments !== "string") {
        //console.log("[POST] attachments keys:", Object.keys(attachments || {}));
    }

    // If attachments is a string that looks like JSON, log that fact
    if (typeof attachments === "string") {
        //console.log("[POST] attachments (string) length:", attachments.length);
        //console.log("[POST] attachments (string) starts with:", attachments.slice(0, 50));
    }

    // --- Data debug ---
    //console.log("[POST] data raw value:", data);
    //console.log("[POST] data typeof:", typeof data);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "8F39D289C2D21ABA1D95845FF5F26BE1");
    myHeaders.append("Origin", process.env.LOONAR_BASE_URL || "");
    myHeaders.append("Content-Type", "application/json");

    try {
        // Safely parse attachments and data, with debug
        let parsedAttachments: any = attachments;
        let parsedData: any = data;

        try {
            if (typeof attachments === "string" && attachments.trim() !== "") {
                parsedAttachments = JSON.parse(attachments);
                //console.log("[POST] parsedAttachments typeof:", typeof parsedAttachments);
                /*console.log(
                    "[POST] parsedAttachments preview:",
                    Array.isArray(parsedAttachments)
                        ? `Array(length=${parsedAttachments.length})`
                        : parsedAttachments
                );*/
            }
        } catch (err) {
            console.error("[POST] Error parsing attachments JSON:", err);
            console.error("[POST] attachments that failed to parse:", attachments);
        }

        try {
            if (typeof data === "string" && data.trim() !== "") {
                parsedData = JSON.parse(data);
                //console.log("[POST] parsedData typeof:", typeof parsedData);
            }
        } catch (err) {
            console.error("[POST] Error parsing data JSON:", err);
            console.error("[POST] data that failed to parse:", data);
        }

        const bodyToSend = {
            attachments: parsedAttachments,
            description: msg,
            email: email,
            data: parsedData,
        };

        //console.log("[POST] Outgoing body to /ticketing/public/report:", bodyToSend);

        const fetchResponse = await fetch(
            (process.env.LOONAR_BE_URL || "") + "/ticketing/public/report",
            {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(bodyToSend),
                redirect: "follow",
                cache: "no-store",
            }
        );

        //console.log("[POST] Fetch status:", fetchResponse.status);
        //console.log("[POST] Fetch headers:", Object.fromEntries(fetchResponse.headers.entries()));

        const fetchRes = await fetchResponse.json();

        //console.log("[POST] Fetch JSON response:", fetchRes);

        if (fetchRes?.error) {
            return NextResponse.json({
                message: "Error in /ticketing/public/report. " + fetchRes?.error,
                status: 500,
            });
        } else {
            return NextResponse.json({ message: fetchRes, status: 200 });
        }
    } catch (e) {
        console.error("[POST] Unexpected error:", e);
        return NextResponse.json({
            message: "Error in /ticketing/public/report. " + e,
            status: 500,
        });
    }
}