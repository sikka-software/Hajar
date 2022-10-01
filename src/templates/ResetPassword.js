import Handlebars from "handlebars";

const emailResetPassword = `<!DOCTYPE html>
<html <% if (email_lang == "ar") { %>dir="rtl" <% } %> lang="<%= email_lang %>">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title><%= email_name_portal %></title>
  <%- include('email-styles'); %>
  <style type="text/css">
    .st0 {
      fill: #5F5FFF;
    }
  </style>
</head>

<body <% if (email_lang == "ar") { %>rightmargin<% } else{ %>leftmargin<% } %>="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
  <div id="wrapper" height="100%" width="100%">
    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" dir="<% if (email_lang == "ar") { %>rtl<% } else{ %>ltr<% } %>">
      <tr>
        <td align="center" valign="top">
          <div id="template_header_image">
            <p style="margin-top:0;">
              <img src="<%= email_logo %>" title="Logo" alt="Logo" />
            </p>
          </div>
          <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
            <tr>
              <td align="center" valign="top">
                <!-- Header -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_header">
                  <tr>
                    <td id="header_wrapper">
                      <h1><%= email_heading %></h1>
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

<p><%= email_translate.hi_txt %></p>
<p><%= email_translate.text_line1 %></p>
<p><%= email_translate.username %> <%= email_customer_email %></p>
<p><%= email_translate.text_line2 %></p>
<p>
  <a class="link" href="<%= email_reset_link %>">
    <%= email_translate.text_link %>
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
												<%= email_footer_text %>
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
    const template = Handlebars.compile(emailResetPassword);
    return template(data);
  }