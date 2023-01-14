import Handlebars from "handlebars";

const emailResetPassword = `<!DOCTYPE html>
<html {{#if email_lang == "ar"}}dir="rtl" {{/if}} lang="{{ email_lang }}">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>{{ email_name_portal }}</title>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital@0;1&display=swap');

.clearfix:after {
content: "";
display: table;
clear: both;
}

a {
color: #5F5FFF;
text-decoration: none;
}

body {
position: relative;
width: 21cm;
height: 29.7cm;
margin: 0 auto;
color: #555555;
background: #FFFFFF;
font-family: Arial, sans-serif;
font-size: 14px;
font-family: 'Source Sans Pro', sans-serif;
}

header {
padding: 10px 0;
margin-bottom: 50px;
border-bottom: 1px solid #AAAAAA;
}

#logo {
float: {{#if invoice_lang == "ar"}}right{{else}}left{{/if}};
margin-top: 8px;
}

#logo img {
height: 70px;
}

#company {
float: {{#if invoice_lang == "ar"}}left{{else}}right{{/if}};
text-align: right;
}


#details {
margin-bottom: 200px;
}

#client {
padding-{{#if invoice_lang == "ar"}}right{{else}}left{{/if}}: 6px;
border-{{#if invoice_lang == "ar"}}right{{else}}left{{/if}}: 6px solid #5F5FFF;
float: {{#if invoice_lang == "ar"}}right{{else}}left{{/if}};
}

#client .to {
color: #777777;
}

h2.name {
font-size: 1.4em;
font-weight: normal;
margin: 0;
}

#invoice {
float: {{#if invoice_lang == "ar"}}left{{else}}right{{/if}};
text-align: right;
}

#invoice h1 {
color: #5F5FFF;
font-size: 2.4em;
line-height: 1em;
font-weight: normal;
margin: 0 0 10px 0;
}

#invoice .date {
font-size: 1.1em;
color: #777777;
}

table {
width: 100%;
border-collapse: collapse;
border-spacing: 0;
margin-bottom: 200px;
}

table th,
table td {
padding: 20px;
background: #EEEEEE;
text-align: center;
border-bottom: 1px solid #FFFFFF;
}

table th {
white-space: nowrap;
font-weight: normal;
}

table td {
text-align: {{#if invoice_lang == "ar"}}left{{else}}right{{/if}};
}

table td h3 {
color: #5F5FFF;
font-size: 1.2em;
font-weight: normal;
margin: 0 0 0.2em 0;
}

table .no {
color: #FFFFFF;
font-size: 1.6em;
background: #5F5FFF;
}

table .desc {
text-align: {{#if invoice_lang == "ar"}}right{{else}}left{{/if}};
}

table .unit {
background: #DDDDDD;
}

table .qty {}

table .total {
background: #5F5FFF;
color: #FFFFFF;
}

table td.unit,
table td.qty,
table td.total {
font-size: 1.2em;
}

table tbody tr:last-child td {
border: none;
}

table tfoot td {
padding: 10px 20px;
background: #FFFFFF;
border-bottom: none;
font-size: 1.2em;
white-space: nowrap;
border-top: 1px solid #AAAAAA;
text-align: {{#if invoice_lang == "ar"}}right{{else}}left{{/if}};
}

table tfoot tr:first-child td {
border-top: none;
}

table tfoot tr:last-child td {
color: #5F5FFF;
font-size: 1.4em;
border-top: 1px solid #5F5FFF !important;

}

table tfoot tr td:first-child {
border: none;
}

table tfoot tr td:last-child {
text-align:{{#if invoice_lang == "ar"}}left{{else}}right{{/if}};
}

#blockSubfooter{
position: relative;
}

#thanks {
font-size: 2em;
margin-bottom: 120px;
}

#qrcode{
position: absolute;
top: -100px;
{{#if invoice_lang == "ar"}}left{{else}}right{{/if}}: 0;
}

#notices {
padding-{{#if invoice_lang == "ar"}}right{{else}}left{{/if}}: 6px;
border-{{#if invoice_lang == "ar"}}right{{else}}left{{/if}}: 6px solid #5F5FFF;
margin-bottom: 160px;
}

#notices .notice {
font-size: 1.2em;
}

footer {
color: #777777;
width: 100%;
height: 30px;
bottom: 0;
border-top: 1px solid #AAAAAA;
padding: 8px 0;
text-align: center;
}

.st0 {
fill: #5F5FFF;
}
  </style>
</head>

<body {{#if email_lang == "ar"}}rightmargin{{else}}leftmargin{{/if}}="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
  <div id="wrapper" height="100%" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" dir="{{#if email_lang == "ar"}}rtl{{else}}ltr{{/if}}">
      <tr>
        <td align="center" valign="top">
          <div id="template_header_image">
            <p style="margin-top:0;">
              <img src="{{ email_logo }}" title="Logo" alt="Logo" />
            </p>
          </div>
          <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
            <tr>
              <td align="center" valign="top">
                <!-- Header -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_header">
                  <tr>
                    <td id="header_wrapper">
                      <h1>{{ email_heading }}</h1>
                    </td>
                  </tr>
                </table>
                <!-- End Header -->
              </td>
            </tr>
            <tr>
              <td align="center" valign="top">
                <!-- Body -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_body">
                  <tr>
                    <td valign="top" id="body_content">
                      <!-- Content -->
                      <table border="0" cellpadding="20" cellspacing="0" width="100%">
                        <tr>
                          <td valign="top">
                            <div id="body_content_inner">

<p>{{ email_translate.hi_txt }}</p>
<p>{{ email_translate.text_line1 }}</p>
<p>{{ email_translate.username }} {{ email_customer_email  }}</p>
<p>{{ email_translate.text_line2  }}</p>
<p>
  <a class="link" href="{{ email_reset_link  }}">
  {{ email_translate.text_link  }}
  </a>
</p>

</div>
														</td>
													</tr>
												</table>
												<!-- End Content -->
											</td>
										</tr>
									</table>
									<!-- End Body -->
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td align="center" valign="top">
						<!-- Footer -->
						<table border="0" cellpadding="10" cellspacing="0" width="600" id="template_footer">
							<tr>
								<td valign="top">
									<table border="0" cellpadding="10" cellspacing="0" width="100%">
										<tr>
											<td colspan="2" valign="middle" id="credit">
												{{ email_footer_text }}
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<!-- End Footer -->
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>`;

export default function getResetEmail(data) {
  const template = Handlebars.compile(emailResetPassword);
  return template(data);
}
