exports.EmailHTML = (subject, message, data) => {
    console.log("subject, message, text", subject, message, data, data.Link)
    return (`<html xmlns="https://www.w3.org/1999/xhtml"><head>
            <meta https-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta https-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
                        <meta name="format-detection" content="telephone=no">
                            <!-- disable auto telephone linking in iOS -->
                            <title>BlackNut</title>
                            <style type="text/css">
/* RESET STYLES */
                                html {
                                    background - color: #eeeeee;
                                margin: 0;
                                padding: 0;
                                }
                                body, #bodyTable, #bodyCell, #bodyCell {
                                    height: 100% !important;
                                margin: 0;
                                padding: 0;
                                width: 100% !important;
                                font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
                                }
                                table {
                                    border - collapse: collapse;
                                }
                                table[id=bodyTable] {
                                    width: 100%!important;
                                margin: auto;
                                max-width: 500px!important;
                                color: #2F2F2F;
                                font-weight: normal;
                                }
                                img, a img {
                                    border: 0;
                                outline: none;
                                text-decoration: none;
                                height: auto;
                                line-height: 100%;
                                }
                                a {
                                    text - decoration: none !important;
                                //border-bottom: 1px solid;
                                }
                                h1, h2, h3, h4, h5, h6 {
                                    color: #5F5F5F;
                                font-weight: normal;
                                font-family: Helvetica;
                                font-size: 20px;
                                line-height: 125%;
                                text-align: Left;
                                letter-spacing: normal;
                                margin-top: 0;
                                margin-right: 0;
                                margin-bottom: 10px;
                                margin-left: 0;
                                padding-top: 0;
                                padding-bottom: 0;
                                padding-left: 0;
                                padding-right: 0;
                                }
                                /* CLIENT-SPECIFIC STYLES */
                                .ReadMsgBody {
                                    width: 100%;
                                }
                                .ExternalClass {
                                    width: 100%;
                                } /* Force Hotmail/Outlook.com to display emails at full width. */
                                .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
                                    line - height: 100%;
                                } /* Force Hotmail/Outlook.com to display line heights normally. */
                                table, td {
                                    mso - table - lspace: 0pt;
                                mso-table-rspace: 0pt;
                                } /* Remove spacing between tables in Outlook 2007 and up. */
                                #outlook a {
                                    padding: 0;
                                } /* Force Outlook 2007 and up to provide a "view in browser" message. */
                                img {
                                    -ms - interpolation - mode: bicubic;
                                display: block;
                                outline: none;
                                text-decoration: none;
                                } /* Force IE to smoothly render resized images. */
                                body, table, td, p, a, li, blockquote {
                                    -ms - text - size - adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                                font-weight: normal!important;
                                } /* Prevent Windows- and Webkit-based mobile platforms from changing declared text sizes. */
                                .ExternalClass td[class="ecxflexibleContainerBox"] h3 {
                                    padding - top: 10px !important;
                                } /* Force hotmail to push 2-grid sub headers down */
                                /* /\/\/\/\/\/\/\/\/ TEMPLATE STYLES /\/\/\/\/\/\/\/\/ */

                                /* ========== Page Styles ========== */
                                h1 {
                                    display: block;
                                font-size: 26px;
                                font-style: normal;
                                font-weight: normal;
                                line-height: 100%;
                                }
                                h2 {
                                    display: block;
                                font-size: 26px;
                                font-style: normal;
                                font-weight: normal;
                                line-height: 120%;
                                color: #12453B;
                                }
                                h3 {
                                    display: block;
                                font-size: 17px;
                                font-style: normal;
                                font-weight: normal;
                                line-height: 110%;
                                }
                                h4 {
                                    display: block;
                                font-size: 18px;
                                font-weight: normal;
                                line-height: 100%;
                                color: #26A699;
                                }
                                .flexibleImage {
                                    height: auto;
                                }
                                .linkRemoveBorder {
                                    border - bottom: 0 !important;
                                }
                                table[class=flexibleContainerCellDivider] {
                                    padding - bottom: 0 !important;
                                padding-top: 0 !important;
                                }
                                body, #bodyTable {
                                    background - color: #eeeeee;
                                }
                                #emailHeader {
                                    background - color: #fff;
                                }
                                #emailBody {
                                    background - color: #fff;
                                }
                                #emailFooter {
                                    background - color: #fff;
                                }
                                .nestedContainer {
                                    background - color: #F8F8F8;
                                border: 1px solid #CCCCCC;
                                }
                                .emailButton {
                                    background - color: #205478;
                                border-collapse: separate;
                                }
                                .buttonContent {
                                    color: #FFFFFF;
                                font-family: Helvetica;
                                font-size: 18px;
                                font-weight: bold;
                                line-height: 100%;
                                padding: 15px;
                                text-align: center;
                                }
                                .buttonContent a {
                                    color: #FFFFFF;
                                display: block;
                                text-decoration: none!important;
                                border: 0!important;
                                }
                                .emailCalendar {
                                    background - color: #FFFFFF;
                                border: 1px solid #CCCCCC;
}
                                .emailCalendarMonth {
                                    background - color: #205478;
                                color: #FFFFFF;
                                font-family: Helvetica, Arial, sans-serif;
                                font-size: 16px;
                                font-weight: bold;
                                padding-top: 10px;
                                padding-bottom: 10px;
                                text-align: center;
}
                                .emailCalendarDay {
                                    color: #205478;
                                font-family: Helvetica, Arial, sans-serif;
                                font-size: 60px;
                                font-weight: bold;
                                line-height: 100%;
                                padding-top: 20px;
                                padding-bottom: 20px;
                                text-align: center;
}
                                .imageContentText {
                                    margin - top: 10px;
                                line-height: 0;
}
                                .imageContentText a {
                                    line - height: 0;
}
                                #invisibleIntroduction {
                                    display: none !important;
} /* Removing the introduction text from the view */
                                /*FRAMEWORK HACKS & OVERRIDES */
                                span[class=ios-color-hack] a {
                                    color: #275100!important;
                                text-decoration: none!important;
} /* Remove all link colors in IOS (below are duplicates based on the color preference) */
                                span[class=ios-color-hack2] a {
                                    color: #205478!important;
                                text-decoration: none!important;
}
                                span[class=ios-color-hack3] a {
                                    color: #8B8B8B!important;
                                text-decoration: none!important;
}
                                /* A nice and clean way to target phone numbers you want clickable and avoid a mobile phone from linking other numbers that look like, but are not phone numbers.  Use these two blocks of code to "unstyle" any numbers that may be linked.  The second block gives you a class to apply with a span tag to the numbers you would like linked and styled.
                                Inspired by Campaign Monitor's article on using phone numbers in email: https://www.campaignmonitor.com/blog/post/3571/using-phone-numbers-in-html-email/.
                                */
                                .a[href^="tel"], a[href^="sms"] {
                                    text - decoration: none!important;
                                color: #606060!important;
                                pointer-events: none!important;
                                cursor: default!important;
}
                                .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                                    text - decoration: none!important;
                                color: #606060!important;
                                pointer-events: auto!important;
                                cursor: default!important;
}


                                /* MOBILE STYLES */
                                @media only screen and (max-width: 767px) {
                                    /*////// CLIENT-SPECIFIC STYLES //////*/
                                    body {
                                    width: 100% !important;
                                min-width: 100% !important;
} /* Force iOS Mail to render the email at full width. */
/* FRAMEWORK STYLES */
/*
CSS selectors are written in attribute
selector format to prevent Yahoo Mail
from rendering media query styles on
desktop.
*/
/*td[class="textContent"], td[class="flexibleContainerCell"] {width: 100%; padding-left: 10px !important; padding-right: 10px !important; }*/
                                table[id="emailHeader"],  table[id="emailBody"],  table[id="emailFooter"],  table[class="flexibleContainer"],  td[class="flexibleContainerCell"] {
                                    width: 100% !important;
}
                                td[class="flexibleContainerBox"], td[class="flexibleContainerBox"] table {
                                    display: block;
                                width: 100%;
                                text-align: left;
}
                                /*
                                The following style rule makes any
                                image classed with 'flexibleImage'
                                fluid when the query activates.
                                Make sure you add an inline max-width
                                to those images to prevent them
                                from blowing out.
                                */
                                td[class="imageContent"] img {
                                    height: auto !important;
                                width: 100% !important;
                                max-width: 100% !important;
}
                                img[class="flexibleImage"] {
                                    height: auto !important;
                                width: 100% !important;
                                max-width: 100% !important;
}
                                img[class="flexibleImageSmall"] {
                                    height: auto !important;
                                width: auto !important;
}
                                /*
                                Create top space for every second element in a block
                                */
                                table[class="flexibleContainerBoxNext"] {
                                    padding - top: 10px !important;
}
                                /*
                                Make buttons in the email span the
                                full width of their container, allowing
                                for left- or right-handed ease of use.
                                */
                                table[class="emailButton"] {
                                    width: 100% !important;
}
                                td[class="buttonContent"] {
                                    padding: 0 !important;
}
                                td[class="buttonContent"] a {
                                    padding: 15px !important;
}
                                .how-wrok table {
                                    width: 100% !important;
}
                                .how-wrok table td {
                                    padding: 10px 0 !important;
}
                                .ftr-div table {
                                    width: 100% !important;
}
                                .ftr-div table .ftr-call {
                                    padding: 10px 0 !important;
}
                                .ftr-div table:nth-child(2) .ftr-call {
                                    border - left: 0 !important;
                                border-top: 1px solid #dddddd !important;
}
                                .ftr-div table:nth-child(3) .ftr-call {
                                    border - left: 0 !important;
                                border-top: 1px solid #dddddd !important
}
                                .ftr-call {
                                    //width: 100% !important;
                                    //padding: 10px 0 !important;
                                    //border-left: 0 !important;
                                    //border-bottom: 1px solid #ddd;
                                }
div > .ftr-call:last-child {
                                    border: 0;
}
                                .thankyou {
                                    float: none !important;
}
                                .paddingMobile0 {
                                    padding: 0 !important;
}
                                .paddingBtmMobile50 {
                                    padding: 0 0 50px 0 !important;
}
                                h2 {
                                    font - size: 28px !important;
                                line-height: 32px !important;
}
                                .widthMobile100 {
                                    width: 100% !important;
}
                                .textCenterMobile {
                                    text - align: center;
}
                                .displayBlockMobile {
                                    display: block !important;
                                margin-right: 0 !important;
	
}
                                .displayBlockMobile a {
                                    font - size: 18px !important;
}
                                .webLink,
                                .callLink {
                                    margin - bottom: 25px !important
}
                                .linkedinIcon img,
                                .instaIcon img {
                                    width: 32px !important;
}
                                .statusIcons span {
                                    margin: 0 4px !important;
}
                                .statusIcons span img {
                                    height: 78px !important;
}
}

                                /*  CONDITIONS FOR ANDROID DEVICES ONLY
                                *   https://developer.android.com/guide/webapps/targeting.html
                                *   https://pugetworks.com/2011/04/css-media-queries-for-targeting-different-mobile-devices/ ;
                                =====================================================*/

                                @media only screen and (-webkit-device-pixel-ratio:.75) {
                                    /* Put CSS for low density (ldpi) Android layouts in here */
                                }
                                @media only screen and (-webkit-device-pixel-ratio:1) {
                                    /* Put CSS for medium density (mdpi) Android layouts in here */
                                }
                                @media only screen and (-webkit-device-pixel-ratio:1.5) {
                                    /* Put CSS for high density (hdpi) Android layouts in here */
                                }
/* end Android targeting */

                                /* CONDITIONS FOR IOS DEVICES ONLY
                                =====================================================*/
                                @media only screen and (min-device-width : 320px) and (max-device-width:568px) {
                                }
/* end IOS targeting */
                            </style>
                        </head>
                        <body bgcolor="#eeeeee" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
                            <center style="background-color: #eeeeee;">
                                <table cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;">
                                    <tbody><tr>
                                        <td align="center" valign="top" id="bodyCell">
                                            <table bgcolor="#181818" cellpadding="0" cellspacing="0" width="600" id="emailBody">
                                                <tbody><tr>
                                                    <td align="center" valign="top">
                                                        <table cellpadding="0" cellspacing="0" width="100%" style="color:#FFFFFF;" bgcolor="#ffffff">
                                                            <tbody><tr>
                                                                <td align="center" valign="top">
                                                                    <table cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" valign="top" width="600" class="flexibleContainerCell">
                                                                                    <table cellpadding="15" cellspacing="0" width="100%">
                                                                                        <tbody><tr>
                                                                                            <td align="center" valign="top" style="background-color: #fff;" class="textContent">
                                                                                                <div class="paddingMobile0" style="padding: 0;">
                                                                                                    <a href="#"><img src="https://i.ibb.co/6yKCnrd/logo.png" alt="logo" width="300"></a>
                                                                                                    <div class="space10" style="height: 10px;"></div>


                                                                                                </div>

                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody></table>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="center" valign="top">
                                                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color:#FFFFFF;" bgcolor="">
                                                                                        <tbody><tr>
                                                                                            <td align="center" valign="top">
                                                                                                <table border="0" cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                                                                                                    <tbody><tr>
                                                                                                        <td align="center" valign="top" width="600" class="flexibleContainerCell">
                                                                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                                                                <tbody><tr>
                                                                                                                    <td align="center" valign="top" class="textContent">
                                                                                                                        <div style="background: #6259ca;position: relative;margin-top: 0;padding: 15px;overflow:hidden;">
                                                                                                                            <div class="widthMobile100" style="width:80%;margin:auto;">
                                                                                                                                <h2 style="text-align:center;font-weight: 600;font-family:Helvetica,Arial,sans-serif;font-size: 20px;color:#ffffff;line-height:36px;margin:0;">${subject}</h2>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                                </tbody></table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    </tbody></table>
                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody></table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody></table>
                                                                </td>
                                                            </tr>
                                                            </tbody></table>
                                                    </td>
                                                </tr>


                                                    <tr><td align="center" valign="top" width="600" class="flexibleContainerCell">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
                                                            <tbody>
                                                                <div class="space15" style="height: 15px;"></div>


                                                                <tr>
                                                                    <td align="center" valign="top">

                                                                        <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>

                                                                                    <td class="textContent" valign="top" align="left">

                                                                                        <div class="paddingMobile0 paddingBtmMobile50" style="padding: 10px 20px;">
                                                                                            <h2 style="text-align:left;font-weight: 600;font-family:Helvetica,Arial,sans-serif;font-size:28px;color: #6259ca;line-height:36px;margin:0;">Hi ${data.type} ${data.Name.trim()},</h2>
                                                                                            <div class="space20" style="height: 20px;"></div>
                                                                                            <p style="text-align:left;font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#000000;line-height:26px;">${message}</p>

                                                                                            <!-- <div class="textCenterMobile" style="font-family:Helvetica,Arial,sans-serif;color:#fff;text-align: center;">
                                                                                                <a href="#" style="background: #6259ca;color:#fff;width:220px; margin:20px 0px;display: inline-block;line-height:43px;border-radius:40px;font-size: 16px;text-align:center;box-shadow:0 4px 2px rgba(0,0,0,.1)">Estimate</a>
                                                                                            </div> -->
                                                                                            ${data.Link!=""|| data.Link!=undefined || data.Link!=null && `<a href='${data.Link}'><button style=" background-color: transparent;outline: 0;border: 0;background: #f2672a;padding: 5px 10px;color: #fff;border-radius: 3px;" onclick="window.location.href='${data.Link}';">Click To Download Agreement File</button></a>`}
                                                                                            <div class="space25" style="height: 25px;"></div>

                                                                                            <p class="textCenterMobile" style="font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#000000;line-height:25px;font-style:normal;font-weight:700 !important;">With Regards!</p>
                                                                                            <div class="space5" style="height: 5px;"></div>
                                                                                            <p class="textCenterMobile" style="font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#000000;line-height:25px;font-style:normal;font-weight:700 !important;">Team BlackNut</p>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody></table>
                                                    </td>



                                                    </tr></tbody></table>
                                            <table cellpadding="0" cellspacing="0" width="600" id="emailFooter">
                                                <tbody><tr>
                                                    <td align="center" valign="top">
                                                        <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#eaedf7">
                                                            <tbody><tr>
                                                                <td align="center" valign="top">
                                                                    <table cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                                                                        <tbody><tr>
                                                                            <td align="center" valign="top" width="600" class="flexibleContainerCell">
                                                                                <table cellpadding="20" cellspacing="0" width="100%">
                                                                                    <tbody><tr>
                                                                                        <td class="textContent" valign="top" align="left">
                                                                                            <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#000000;text-align:center;line-height:20px;margin-bottom: 0;">
                                                                                                <center>
                                                                                                    <div class="displayBlockMobile" style="display:inline-block;vertical-align:middle;margin-right:30px;">
                                                                                                        <a class="webLink" href="#" target="_blank" style="color: #000000; font-weight:400 !important; text-decoration: none !important;display:inline-block;vertical-align:middle;"><i style="display:inline-block;vertical-align: middle;margin-right: 6px;"><img src="https://i.ibb.co/5vB7X3g/web-icon.png"></i> www.blacknut.com</a>
                                                                                                    </div>
                                                                                                    <div class="displayBlockMobile" style="display:inline-block;vertical-align:middle;margin-right:0;">
                                                                                                        <a class="callLink" href="tel:+1-844-999-3444" target="_blank" style="color: #000000; font-weight:400 !important; text-decoration: none !important;display:inline-block;vertical-align:middle;"><i style="display:inline-block; vertical-align: middle; margin-right: 8px;"><img src="https://i.ibb.co/f0frhXf/call-icon.png"></i> +91 9896098960</a>

                                                                                                    </div>

                                                                                                </center>
                                                                                            </div>
                                                                                            <div class="space15" style="height: 15px;"></div>
                                                                                            <div class="displayBlockMobile" style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#000000;text-align:center;line-height:20px;">
                                                                                                <center>
                                                                                                    <div class="displayBlockMobile" style="display:inline-block;vertical-align:middle;">
                                                                                                        <a class="linkedinIcon" href="https://facebook.com/" target="_blank" style="display: inline-block;vertical-align:middle; margin: 0;">
                                                                                                            <img src="https://i.ibb.co/SVVwXJs/facebook-icon.png">
                                                                                                        </a>
                                                                                                        <a class="linkedinIcon" href="https://in.linkedin.com/" target="_blank" style="display: inline-block;vertical-align:middle; margin-left: 5px;">
                                                                                                            <img src="https://i.ibb.co/CB4Sksb/linkedin-icon.png">
                                                                                                        </a>
                                                                                                        <a class="instaIcon" href="https://www.instagram.com/" target="_blank" style="display: inline-block;vertical-align:middle; margin-left: 5px;">
                                                                                                            <img src="https://i.ibb.co/NVx35pW/instagram-icon.png">
                                                                                                        </a>
                                                                                                    </div>
                                                                                                </center>
                                                                                            </div>




                                                                                        </td>
                                                                                    </tr>
                                                                                    </tbody></table>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody></table>
                                                                </td>
                                                            </tr>
                                                            </tbody></table>
                                                    </td>
                                                </tr>
                                                    <tr>
                                                        <td align="center" valign="top">
                                                            <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#0e0e23">
                                                                <tbody><tr>
                                                                    <td align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="600" class="flexibleContainer">
                                                                            <tbody><tr>
                                                                                <td align="center" valign="top" width="600" class="flexibleContainerCell">
                                                                                    <table cellpadding="15" cellspacing="0" width="100%">
                                                                                        <tbody><tr>
                                                                                            <td class="textContent" valign="middle" align="left">
                                                                                                <div style="font-weight:500;font-family:Helvetica,Arial,sans-serif;font-size:16px;color:#fff;text-align:center;line-height:20px;"><i style="display:inline-block; vertical-align: middle; margin-right: 5px;"><img src="https://i.ibb.co/ZWjVSKf/footer-logo.png" width="24px"></i> Copyright BlackNut 2023</div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody></table>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody></table>
                                                                    </td>
                                                                </tr>
                                                                </tbody></table>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                        </td>
                                    </tr>
                                    </tbody></table>
                            </center>
                        </body>
                    </html>`)
}