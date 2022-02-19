const wkhtmltopdf = require("wkhtmltopdf");
const ejs = require("ejs");
const moment = require("moment");
const { Base64Encode } = require("base64-stream");
const fs = require("fs");
const QRCode = require("qrcode");
const { formatCurrency } = require("../helpers");

/*
backend_url: ""
invoice_id: ""
invoice_lang: ""
invoice_company: {
  logo: "URL TO LOGO"
  name: "Sikka Software Est",
  address: "Ash Shati Ash Sharqi, Dammam. Eastern Region, Saudi Arabia",
  phone: "",
  email: "contact@qawaim.app"
}
invoice_customer:{
  full_name: "",
  full_address: "", //address_line_1 + " " + address_line_2 + " " + city + " " + zip_code + " " + state + "," + country
  email: ""
}
products: [
  { 
    product_name: "PRODUCT NAME",
    product_price: 00.00 
  }
]
invoice_date: "01/11/2020"
invoice_currency: "SAR"

*/

async function create(dataInvoice, lang) {
  let urlQrcode = await QRCode.toDataURL(
    `${dataInvoice.backend_url}/invoice/${dataInvoice.invoice_id}`
  );

  let data = {
    invoice_lang: dataInvoice.invoice_lang,
    invoice_company: dataInvoice.invoice_company,
    invoice_customer: {
      full_name: dataInvoice.full_name,
      full_address: dataInvoice.full_address,
      email: dataInvoice.email,
    },
    invoice_data: {
      qrCodeURL: urlQrcode,
      invoice_id: "#" + dataInvoice.invoice_id,
      date_invoice: moment(new Date(dataInvoice.invoice_date)).format(
        dataInvoice.invoice_lang == "ar" ? "YYYY/MM/DD" : "DD/MM/YYYY"
      ),
      date_due: moment(new Date(dataInvoice.invoice_date)).format(
        dataInvoice.invoice_lang == "ar" ? "YYYY/MM/DD" : "DD/MM/YYYY"
      ),
      products: dataInvoice.products,
    },
    invoice_translate: {
      invoice: dataInvoice.invoice_lang == "ar" ? "فاتورة " : "INVOICE ",
      invoice_to:
        dataInvoice.invoice_lang == "ar" ? "فاتورة إلى:" : "INVOICE TO:",
      date_invoice:
        dataInvoice.invoice_lang == "ar"
          ? "تاريخ الفاتورة: "
          : "Date of Invoice: ",
      date_due:
        dataInvoice.invoice_lang == "ar" ? "تاريخ الدفع: " : "Due Date: ",
      table: {
        description:
          dataInvoice.invoice_lang == "ar" ? "الباقة" : "DESCRIPTION",
        unit_price:
          dataInvoice.invoice_lang == "ar" ? "سعر الوحدة" : "UNIT PRICE",
        quantity: dataInvoice.invoice_lang == "ar" ? "كمية" : "QUANTITY",
        total_product: dataInvoice.invoice_lang == "ar" ? "المجموع" : "TOTAL",
        subtotal:
          dataInvoice.invoice_lang == "ar" ? "المجموع الفرعي" : "SUBTOTAL",
        grandtotal:
          dataInvoice.invoice_lang == "ar" ? "المبلغ الإجمالي" : "GRAND TOTAL",
      },
      thanks: dataInvoice.invoice_lang == "ar" ? "شكرا لك!" : "Thank you!",
      footer:
        langdataInvoice.invoice_lang == "ar"
          ? "تم إنشاء الفاتورة على جهاز كمبيوتر وهي صالحة بدون التوقيع والختم."
          : "Invoice was created on a computer and is valid without the signature and seal.",
      notice: dataInvoice.invoice_lang == "ar" ? "تنويه:" : "NOTICE:",
      notice_text:
        langdataInvoice.invoice_lang == "ar"
          ? "سيتم فرض رسوم تمويل بنسبة 1.5٪ على الأرصدة غير المدفوعة بعد 30 يومًا."
          : "A finance charge of 1.5% will be made on unpaid balances after 30 days.",
    },
  };
  if (is_mail) {
    ejs.renderFile(
      "template/invoice/tpl-invoice.ejs",
      data,
      {},
      function (err, str) {
        console.log(err);
        console.log(str);
        wkhtmltopdf(str).pipe(
          fs.createWriteStream(
            `invoices/invoice-${dataInvoice.invoice_id}.pdf`,
            { flags: "w" }
          )
        );
      }
    );
  } else {
    ejs.renderFile(
      "template/invoice/tpl-invoice.ejs",
      data,
      {},
      function (err, str) {
        console.log(err);
        //console.log(str);
        //let stream = wkhtmltopdf(str);
        //let blob = stream.toBlob('application/pdf');
        wkhtmltopdf(str).pipe(new Base64Encode()).pipe(res);
      }
    );
  }
}

module.exports = {
  invoice: create,
};
