/*
List Variable:
email_lang
email_name_portal
email_customer_name
email_customer_email
email_reset_link
email_translate
*/

const emailVerifyEmail = `<!DOCTYPE html>
<html {{#if email_lang == "ar"}}{{dir="rtl"}}{{/if}} lang="{{email_lang}}">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>{{email_name_portal}}</title>
<style>
    body {
        padding: 0;
    }
    #wrapper {
        /* background-color: #f7f7f7; */
        margin: 0;
        padding: 70px 0;
        -webkit-text-size-adjust: none !important;
        width: 100%;
    }
    #template_container {
        /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important; */
        background-color: #f7f7f7;
        border: 1px solid #dedede;
        /* border-radius: 3px !important; */
     border-radius: 0px 0px 10px 10px !important;
    }
    #template_header {
        background-color: #0843ff;
        border-radius: 10px 10px 0 0 !important;
        color: #ffffff;
        border-bottom: 0;
        font-weight: bold;
        line-height: 100%;
        vertical-align: middle;
        font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
    }
    #template_header h1,
    #template_header h1 a {
        color: #ffffff;
        background-color: inherit;
    }
    #template_header_image img {
        margin-left: 0;
        margin-right: 0;
     max-height: 80px;
    }
    #template_footer td {
        padding: 0;
        border-radius: 6px;
    }
    #template_footer #credit {
        border: 0;
        color: #8a8a8a;
        font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
        font-size: 12px;
        line-height: 150%;
        text-align: center;
        padding: 24px 0;
    }
    #template_footer #credit p {
        margin: 0 0 16px;
    }
    #body_content {
        background-color: #ffffff;
    }
    #body_content table td {
        padding: 48px 48px 32px;
    }
    #body_content table td td {
        padding: 12px;
    }
    #body_content table td th {
        padding: 12px;
    }
    #body_content td ul.wc-item-meta {
        font-size: small;
        margin: 1em 0 0;
        padding: 0;
        list-style: none;
    }
    #body_content td ul.wc-item-meta li {
        margin: 0.5em 0 0;
        padding: 0;
    }
    #body_content td ul.wc-item-meta li p {
        margin: 0;
    }
    #body_content p {
        margin: 0 0 16px;
    }
    #body_content_inner {
        color: #636363;
        font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
        font-size: 14px;
        line-height: 150%;
        text-align: {{#if email_lang == "ar"}}right{{else}}left{{/if}};
    }
    .td {
        color: #636363;
        border: 1px solid #e5e5e5;
        vertical-align: middle;
    }
    .address {
        padding: 12px;
        color: #636363;
        border: 1px solid #e5e5e5;
    }
    .text {
        color: #3c3c3c;
        font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
    }
    .link {
        color: #0843ff;
    }
    #header_wrapper {
        padding: 36px 48px;
        display: block;
    }
    h1 {
        color: #0843ff;
        font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
        font-size: 30px;
        font-weight: 300;
        line-height: 150%;
        margin: 0;
        text-align: {{#if email_lang == "ar"}}right{{else}}left{{/if}};
        text-shadow: 0 1px 0 #ab79a1;
    }
    h2 {
        color: #0843ff;
        display: block;
        font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
        font-size: 18px;
        font-weight: bold;
        line-height: 130%;
        margin: 0 0 18px;
        text-align: {{#if email_lang == "ar"}}right{{else}}left{{/if}};
    }
    h3 {
        color: #0843ff;
        display: block;
        font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        line-height: 130%;
        margin: 16px 0 8px;
        text-align:  {{#if email_lang == "ar"}}right{{else}}left{{/if}};
    }
    a {
        color: #0843ff;
        font-weight: normal;
        text-decoration: underline;
    }
    img {
        border: none;
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
        height: auto;
        outline: none;
        text-decoration: none;
        text-transform: capitalize;
        vertical-align: middle;
        margin-{{#if email_lang == "ar"}}left{{else}}right{{/if}}: 10px;
        max-width: 100%;
        height: auto;
    }
  </style>
  <style type="text/css">
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
              <img src="{{email_logo}}" title="Logo" alt="Logo" />
            </p>
          </div>
          <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
            <tr>
              <td align="center" valign="top">
                <!-- Header -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_header">
                  <tr>
                    <td id="header_wrapper">
                      <h1>{{email_heading}}</h1>
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


<p>{{email_translate.hi_txt}}</p>
<p>{{email_translate.text_line}}</p>
<p>
	<a class="link" href="{{email_reset_link}}">
        {{email_translate.text_link}}
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
    {{email_footer_text}}
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
export default function getVerifyEmail(data) {
  const template = Handlebars.compile(emailVerifyEmail);
  return template(data);
}
