
const emailInvoiceHtml = `
<!DOCTYPE html>
<html {{#if invoice_lang == "ar"}}dir="rtl"{{/if}} lang="{{ invoice_lang }}">

<head>
  <meta charset="utf-8">
  <title>{{ invoice_translate.invoice }}{{ invoice_data.invoice_id }}</title>
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

<body>
  <header class="clearfix">
    <div id="logo">

      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 495.4 231.1" style="enable-background:new 0 0 495.4 231.1;" xml:space="preserve" width="100" height="70">
        <style type="text/css">
          .st0 {
            fill: #5F5FFF;
          }
        </style>
        <g>
          <path d="M51.7,199.6c0,1.5-0.2,3.1-0.7,4.5c-0.5,1.5-1.3,2.8-2.3,3.9c-1.3,1.3-2.9,2.3-4.7,2.9c-2.3,0.8-4.8,1.1-7.3,1.1
		c-2.2,0-4.1,0-5.8,0l-4.5-0.6c-0.4,0-0.7-0.1-1-0.4c0-0.3,0-0.5,0-0.8v-2.5c-0.1-0.2-0.1-0.5,0-0.7c0.2-0.1,0.5-0.1,0.7,0l0,0h2.4
		h2.7h5.4c1.6,0,3.1-0.2,4.7-0.6c1.1-0.2,2-0.7,2.8-1.5c0.7-0.6,1.2-1.4,1.5-2.3c0.3-1,0.5-2,0.4-3c0-0.7-0.1-1.4-0.4-2.1
		c-0.3-0.7-0.7-1.3-1.2-1.9c-0.7-0.7-1.5-1.4-2.3-2l-3.5-2.3l-6-3.6c-2.4-1.4-4.6-3.1-6.4-5.2c-3.4-4.5-2.6-10.9,1.7-14.6
		c3.3-1.9,7.2-2.9,11-2.6h2.9h3h2.7h2.2c0.7,0,1.1,0.4,1.1,1.1v2.6c0,0.7-0.4,1-1.1,1l0,0h-5h-5.7c-2.5-0.2-5,0.2-7.3,1.2
		c-1.5,1-2.3,2.8-2.1,4.7c0,1.4,0.6,2.8,1.6,3.8c1.6,1.4,3.3,2.6,5.2,3.7l5.7,3.3c1.6,0.9,3.1,2,4.5,3.1c1.1,0.9,2.1,1.9,3.1,3
		c0.7,0.9,1.3,2,1.7,3.1C51.5,197.2,51.7,198.4,51.7,199.6z" />
          <path d="M113.7,192.5c0.1,3-0.3,6-1.2,8.9c-0.7,2.2-1.9,4.3-3.4,6c-1.5,1.5-3.3,2.7-5.3,3.4c-4.4,1.6-9.1,1.6-13.5,0
		c-2-0.7-3.8-1.9-5.3-3.4c-1.5-1.8-2.7-3.8-3.5-6c-0.9-2.9-1.3-5.9-1.2-8.9v-8c-0.1-3,0.4-6,1.3-8.8c0.7-2.2,1.9-4.3,3.5-6
		c1.5-1.6,3.3-2.8,5.3-3.5c4.4-1.5,9.1-1.5,13.5,0c2,0.7,3.8,1.9,5.3,3.5c1.6,1.7,2.7,3.8,3.4,6c0.9,2.8,1.3,5.8,1.2,8.8
		L113.7,192.5z M108,184.5c0-2.2-0.2-4.5-0.8-6.6c-0.4-1.6-1.2-3.1-2.2-4.4c-0.9-1.2-2.1-2-3.5-2.5c-1.5-0.5-3-0.8-4.6-0.7
		c-1.6,0-3.1,0.2-4.6,0.7c-1.4,0.5-2.6,1.4-3.5,2.5c-1,1.3-1.8,2.8-2.3,4.4c-0.5,2.2-0.8,4.4-0.7,6.6v8c-0.1,2.2,0.2,4.5,0.7,6.6
		c0.5,1.6,1.2,3.2,2.3,4.5c0.9,1.1,2.1,2,3.5,2.5c1.5,0.5,3,0.8,4.6,0.8c1.6,0,3.1-0.3,4.6-0.8c1.4-0.5,2.6-1.4,3.5-2.5
		c1-1.3,1.8-2.9,2.2-4.5c0.6-2.2,0.8-4.4,0.8-6.6V184.5z" />
          <path d="M169.9,188.8c0.1,0.3,0.1,0.6,0,0.9c-0.3,0.1-0.6,0.1-0.9,0h-19.4v20.5c0,0.3-0.1,0.6-0.4,0.9c-0.3,0.1-0.6,0.1-0.9,0h-3.1
		c-0.3,0.1-0.6,0.1-0.9,0c-0.2-0.2-0.3-0.6-0.4-0.9v-33.6c-0.3-3.3,0.9-6.6,3.3-8.9c2.9-1.9,6.4-2.9,9.9-2.6h3.1h3.4h3.1h2.5h0.5
		c0,0.2,0,0.4,0,0.6v3.1c0,0.5,0,0.8-0.7,0.8h-11.9c-1.3-0.1-2.6-0.1-3.9,0c-0.9,0.2-1.7,0.6-2.3,1.2c-0.5,0.5-0.9,1.2-1.1,2
		c-0.1,1-0.1,2,0,3v8.7H169c0.3-0.1,0.6-0.1,0.9,0c0.1,0.3,0.1,0.6,0,0.9L169.9,188.8z" />
          <path d="M229.4,169.4c0,0.7-0.4,0.9-1.2,0.9h-12.1v39.9c0.1,0.3,0.1,0.6,0,0.9c-0.3,0.1-0.5,0.1-0.8,0H212c-0.3,0.1-0.5,0.1-0.8,0
		c-0.1-0.3-0.1-0.6,0-0.9v-40h-12.7c-0.3,0.1-0.6,0.1-0.9,0c-0.1-0.2-0.1-0.5,0-0.7v-2.9c-0.1-0.3-0.1-0.5,0-0.8
		c0.3-0.1,0.6-0.1,0.9,0h29.8c0.8,0,1.2,0,1.2,1.1V169.4z" />
          <path d="M302.4,166.5l-6.9,41.9c0,1-0.5,2-1.3,2.5c-0.8,0.4-1.6,0.6-2.5,0.6H289c-0.8,0-1.6-0.3-2.3-0.8c-0.6-0.6-1.1-1.4-1.2-2.3
		l-6.1-22.9c0-0.2,0-0.3,0-0.5h-0.4c0,0.2,0,0.3,0,0.5l-6.1,22.9c-0.2,0.9-0.7,1.7-1.3,2.3c-0.6,0.5-1.4,0.8-2.3,0.8h-2.6
		c-0.9,0-1.7-0.2-2.5-0.6c-0.8-0.6-1.2-1.6-1.3-2.5l-7.3-41.9l0,0c0-0.7,0-1,1.1-1h3.6c0.6,0,0.9,0,1.1,1l6,39.5c0,0.2,0,0.5,0,0.7
		l0,0c0,0,0.4-0.4,0.4-0.9l6.1-22.9c0.2-1.5,1.4-2.6,2.9-2.5h3.9c1.5-0.1,2.8,1,2.9,2.5l6.1,22.9c0,0.6,0,0.9,0.4,0.9s0,0,0,0
		c0-0.2,0-0.5,0-0.7l6.6-39.5c0-0.6,0.5-1,1-1h3.6c0.5,0,1,0.3,1,0.9C302.4,166.4,302.4,166.5,302.4,166.5z" />
          <path d="M360.9,210.6c0,0.5-0.3,1-0.9,1c-0.1,0-0.1,0-0.2,0h-3.7c-0.2,0.1-0.4,0.1-0.7,0c0-0.2,0-0.4,0-0.7l-4-14.6h-16.4
		l-3.9,14.6l-0.4,0.7c-0.2,0.1-0.5,0.1-0.7,0h-3.6c-0.7,0-1.1,0-1.1-1c0-0.1,0-0.3,0-0.4l11.5-40.3c0.2-0.9,0.5-1.7,1.1-2.3
		c0.4-0.6,0.9-1.1,1.5-1.5c0.6-0.3,1.2-0.6,1.9-0.7c0.6-0.1,1.2-0.1,1.8,0h1.7c0.6,0.1,1.3,0.4,1.8,0.7c0.6,0.4,1.1,0.9,1.6,1.5
		c0.5,0.7,0.9,1.5,1.1,2.3l11.4,40.4C360.8,210.2,360.9,210.2,360.9,210.6z M344.3,171c0-0.7-0.6-1.1-1.2-1.1c-0.6,0-1,0.4-1.2,1.1
		l-5.7,20.5h13.5L344.3,171z" />
          <path d="M420.7,210.8c0,0.4-0.2,0.8-0.6,0.8c-0.1,0-0.1,0-0.2,0h-4H415c-0.3-0.2-0.5-0.4-0.7-0.7l-11.1-18.5h-4.6h-3.9v17.8
		c0.1,0.3,0.1,0.6,0,0.9c-0.3,0.1-0.5,0.1-0.8,0h-3.3c-0.3,0.1-0.5,0.1-0.8,0c-0.1-0.3-0.1-0.6,0-0.9v-43.7c-0.1-0.3-0.1-0.6,0-0.9
		c0.4-0.2,0.8-0.3,1.2-0.4h2.3h2.8h3h2.8c2.3,0,4.6,0.2,6.8,0.7c2,0.4,3.8,1.2,5.5,2.3c1.5,1,2.8,2.4,3.6,4.1c0.9,2,1.4,4.1,1.3,6.3
		v0.4c0,1.6-0.2,3.2-0.7,4.7c-0.4,1.3-1.1,2.6-2,3.6c-0.9,1-1.9,1.9-3.1,2.6c-1.2,0.7-2.6,1.2-3.9,1.6l11,18.7
		C420.6,210.4,420.7,210.6,420.7,210.8z M413.4,178.4c0.2-2.5-0.9-5-3-6.5c-2.7-1.3-5.8-1.9-8.8-1.7h-6.8v17h6.8
		c1.7,0.1,3.4,0.1,5,0c1.3-0.2,2.6-0.7,3.7-1.4c1-0.7,1.8-1.6,2.3-2.7c0.6-1.3,0.8-2.7,0.8-4.2V178.4z" />
          <path d="M475.6,210.8c0,0.2,0,0.4,0,0.6c-0.2,0.1-0.3,0.1-0.5,0h-2.3h-3.2H463c-3.5,0.2-7-0.7-9.9-2.7c-2.4-2.3-3.6-5.6-3.3-8.9
		v-23.2c-0.3-3.3,0.9-6.6,3.3-8.9c2.9-1.9,6.4-2.9,9.9-2.6h3.1h3.4h3.1h2.5h0.5c0,0.2,0,0.4,0,0.6v3.1c0,0.5,0,0.8-0.7,0.8h-12
		c-1.3-0.1-2.6-0.1-3.9,0c-0.9,0.2-1.7,0.6-2.3,1.2c-0.5,0.5-0.9,1.2-1.1,2c-0.1,1-0.1,2,0,3v8.7h19.1c0.3-0.1,0.6-0.1,0.9,0
		c0.1,0.3,0.1,0.6,0,0.9v2.3c0.1,0.3,0.1,0.6,0,0.9c-0.3,0.1-0.6,0.1-0.9,0h-19.4v10.4c-0.1,1-0.1,2,0,3c0.2,0.8,0.5,1.5,1.1,2
		c0.7,0.6,1.5,1,2.3,1.1c1.3,0.1,2.6,0.1,3.9,0h12.2c0.5,0,0.7,0,0.7,0.7L475.6,210.8z" />
          <path d="M58.8,142c-11.6,0.1-23.1-1-34.4-3.3c-2.8-0.7-4.6-2-4.6-4.4v-7.3c0.1-2,1.9-3.4,3.8-3.3c0,0,0.1,0,0.1,0h0.9
		c10.5,1.3,26.4,2.4,34.2,2.4c14.1,0,21.8-3.7,21.8-15.5c0-6.6-3.9-10.6-16.3-18.1L42.5,79.5c-13.3-8-22.2-17.4-22.2-31.2
		c0-22.6,17-29.1,39.5-29.1c11.4,0,22.8,0.9,34,2.8c2.3,0,4.1,1.9,4.1,4.2c0,0.1,0,0.1,0,0.2v7.3c0.3,1.8-1,3.5-2.8,3.7
		c-0.3,0-0.6,0-0.9,0h-0.7c-7.6-0.7-21.8-1.7-33.8-1.7s-20.2,1.5-20.2,12.6c0,6.6,5,10.7,15,16.6l21.8,12.8
		c18.1,10.7,24,20.1,24,32.9C99.5,132.6,83.2,142,58.8,142z" />
          <path d="M142.5,140.5H132c-2.4,0-4.4-2-4.4-4.4V25c0-2.4,2-4.4,4.4-4.4h10.5c2.4,0,4.4,2,4.4,4.4v111.1
		C146.9,138.5,144.9,140.5,142.5,140.5z" />
          <path d="M471.2,140.5h-10c-2.4,0-4.4-2-4.4-4.4v-4.8c-10,6.5-21.6,10.2-33.5,10.7c-18.6,0-35.5-8.1-35.5-35.3V104
		c0-23.5,13.7-35.2,52.5-35.2h16.1v-8.7c0-18.3-6.3-24.6-23.3-24.6c-11.1,0-22.3,0.6-33.3,1.7h-1.1c-1.9,0-3.9-0.7-3.9-3.5v-7.6
		c0-2.4,1.5-3.7,4.5-4.2c11.2-2,22.5-2.9,33.8-2.8c30.3,0,42.5,15.3,42.5,41v76C475.6,138.5,473.6,140.5,471.2,140.5
		C471.2,140.5,471.2,140.5,471.2,140.5z M456.7,82.2h-16.4c-26.4,0-33.3,5.9-33.3,21.3v2.6c0,15.7,7.3,19.9,20,19.9
		c10.3-0.3,20.3-3.4,29.1-8.7L456.7,82.2z" />
          <path d="M323.7,77.3l47.8-51.8c0.6-0.6,1-1.5,1.1-2.4c0-1.3-1.1-2.4-3.3-2.4h-15c-1.7-0.2-3.4,0.6-4.4,2l-43.7,49.1v-0.4l-5.5,6
		l5.5,6.8l43.5,53.4c1.7,2.2,2.6,2.8,5,2.8h15.7c1.4-0.1,2.5-1.3,2.4-2.7c0-0.1,0-0.1,0-0.2c0-0.7-0.2-1.4-0.7-2L323.7,77.3z" />
          <path d="M302.5,108.3c2.5,3.2,3.8,7.1,3.9,11.1v16.9c0,2.4-2,4.4-4.4,4.4h-10.6c-2.4,0-4.4-2-4.4-4.4V88.9L302.5,108.3z" />
          <path d="M306.3,24V40c0,3.4-1.3,6.7-3.5,9.3l-15.7,18V23.7c0-2.4,2-4.4,4.4-4.4h10.5c2.4,0,4.4,1.9,4.4,4.4
		C306.3,23.8,306.3,23.9,306.3,24z" />
          <path class="st0" d="M330.9,81.8c-2.2-2.5-2.2-6.3,0-8.9l43.7-47.5c0.7-0.6,1.1-1.5,1.1-2.4c0-1.3-1.1-2.4-3.3-2.4h-21.8
		c-1.7-0.2-3.4,0.6-4.4,2L300.9,73c-2.2,2.5-2.2,6.2,0,8.7l45.4,55.6c1.7,2.2,2.6,2.8,5,2.8h22.3c1.4-0.1,2.5-1.3,2.4-2.7
		c0-0.1,0-0.1,0-0.2c0-0.7-0.2-1.4-0.7-2L330.9,81.8z" />
          <path d="M262.3,139.1h-15.6c-2.4,0-3.2-0.6-5-2.8L198,83.2v51.6c0,2.4-1.9,4.3-4.3,4.3c0,0,0,0-0.1,0h-10.2c-2.4,0-4.3-1.9-4.4-4.2
		c0,0,0,0,0-0.1v-111c0-2.4,2-4.3,4.4-4.3h10.4c2.4,0,4.3,1.9,4.4,4.3v47l43.7-48.6c1-1.4,2.6-2.1,4.3-1.9h15.3c2.2,0,3.3,1,3.3,2.3
		c0,0.9-0.4,1.8-1.1,2.4l-48,51.4l48.4,58.2c0.4,0.6,0.7,1.3,0.7,2C264.8,138,263.7,139.1,262.3,139.1
		C262.3,139.1,262.3,139.1,262.3,139.1z" />
        </g>
      </svg>

    </div>
    <div id="company">
      <h2 class="name"><%= invoice_company.name %></h2>
      <div><%= invoice_company.address %></div>
      <div><%= invoice_company.phone %></div>
      <div><a href="mailto:<%= invoice_company.email %>"><%= invoice_company.email %></a></div>
    </div>
    </div>
  </header>
  <main>
    <div id="details" class="clearfix">
      <div id="client">
        <div class="to"><%= invoice_translate.invoice_to %></div>
        <h2 class="name"><%= invoice_customer.full_name %></h2>
        <div class="address"><%= invoice_customer.address %></div>
        <div class="email"><a href="mailto:<%= invoice_customer.email %>"><%= invoice_customer.email %></a></div>
      </div>
      <div id="invoice">
        <h1><%= invoice_translate.invoice %><%= invoice_data.invoice_id %></h1>
        <div class="date"><%= invoice_translate.date_invoice %><%= invoice_data.date_invoice %></div>
        <div class="date"><%= invoice_translate.date_due %><%= invoice_data.date_due %></div>
      </div>
    </div>
    <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 50px;">
      <thead>
        <tr>
          <th class="no">#</th>
          <th class="desc"><%= invoice_translate.table.description %></th>
          <th class="unit"><%= invoice_translate.table.unit_price %></th>
          <th class="total"><%= invoice_translate.table.total_product %></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="no" style="text-align:center">01</td>
          <td class="desc">
            <h3><%= invoice_data.pack_title %></h3><%= invoice_data.pack_subtitle %>
          </td>
          <td class="unit" style="text-align:center"><%= invoice_data.pack_price %></td>
          <td class="total" style="text-align:center"><%= invoice_data.pack_price %></td>
        </tr>
      </tbody>
    </table>
    <table border="0" cellspacing="0" cellpadding="0">
      <tfoot>
        <tr>
          <td colspan="3"><%= invoice_translate.table.subtotal %></td>
          <td><%= invoice_data.pack_price %></td>
        </tr>
        <tr>
          <td colspan="3"><%= invoice_translate.table.grandtotal %></td>
          <td><%= invoice_data.pack_price %></td>
        </tr>
      </tfoot>
    </table>
    <div id="blockSubfooter"><div id="thanks"><%= invoice_translate.thanks %></div>
    <div id="qrcode"><img src="<%= invoice_data.qrCodeURL %>" /></div></div>
    <!-- <div id="notices">
      <div><%= invoice_translate.notice %></div>
      <div class="notice"><%= invoice_translate.notice_text %></div>
    </div> -->
  </main>
  <footer>
    <%= invoice_translate.footer %>
  </footer>
</body>

</html>`;
export default function getEmailInvoiceTemplate(data) {
    const template = Handlebars.compile(emailInvoiceHtml);
    return template(data);
}