const wkhtmltopdf = require("wkhtmltopdf");
const ejs = require("ejs");
const moment = require("moment");
const { Base64Encode } = require("base64-stream");
const fs = require("fs");
const QRCode = require("qrcode");
const { getTotals, formatCurrency } = require("../helpers");

/*
backend_url: ""
invoice_id: ""
invoice_lang: ""
invoice_company: {
  logo{
    src: "URL TO LOGO",
    width
    height
    alt
  }
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
    product_description: "PRODUCT NAME",
    product_price: 00.00 
  }
]
invoice_vat: "01/11/2020"
invoice_discount: "01/11/2020"
invoice_date: "01/11/2020"
invoice_currency: "SAR"

*/

async function invoiceCreate(dataInvoice) {
  var dirInvoice = __appdir + "/invoices";
  if (!fs.existsSync(dirInvoice)) {
    fs.mkdirSync(dirInvoice, { recursive: true });
  }

  let urlQrcode = await QRCode.toDataURL(
    `${dataInvoice.backend_url}/invoice/${dataInvoice.invoice_id}`
  );

  let totals = getTotals(
    dataInvoice.products,
    dataInvoice.invoice_vat,
    dataInvoice.invoice_discount
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
      totals: {
        subtotal: totals.subtotal,
        total: totals.total,
        vat: totals.vat,
        discount: totals.discount,
      },
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
        discount:
          dataInvoice.invoice_lang == "ar" ? "إجمالي الخصم" : "DISCOUNT",
        vat: dataInvoice.invoice_lang == "ar" ? "إجمالي ضريبة" : "VAT",
        grandtotal:
          dataInvoice.invoice_lang == "ar" ? "المبلغ الإجمالي" : "GRAND TOTAL",
      },
      thanks: dataInvoice.invoice_lang == "ar" ? "شكرا لك!" : "Thank you!",
      footer:
        dataInvoice.invoice_lang == "ar"
          ? "تم إنشاء الفاتورة على جهاز كمبيوتر وهي صالحة بدون التوقيع والختم."
          : "Invoice was created on a computer and is valid without the signature and seal.",
      notice: dataInvoice.invoice_lang == "ar" ? "تنويه:" : "NOTICE:",
      notice_text:
        dataInvoice.invoice_lang == "ar"
          ? "سيتم فرض رسوم تمويل بنسبة 1.5٪ على الأرصدة غير المدفوعة بعد 30 يومًا."
          : "A finance charge of 1.5% will be made on unpaid balances after 30 days.",
    },
  };
  var path_template = `${__basedir}/invoice/templates/tpl-invoice.ejs`;
  var dir_override = `${__appdir}/Hajar`;
  var file_override = `${dir_override}/tpl-invoice.ejs`;
  if (fs.existsSync(dir_override) && fs.existsSync(file_override)) {
    path_template = file_override;
  }
  if (!dataInvoice?.return) {
    ejs.renderFile(path_template, data, {}, function (err, str) {
      console.log(err);
      console.log(str);
      wkhtmltopdf(str).pipe(
        fs.createWriteStream(
          `${dirInvoice}/invoice-${dataInvoice.invoice_id}.pdf`,
          { flags: "w" }
        )
      );
    });
    return true;
  } else {
    ejs.renderFile(path_template, data, {}, function (err, str) {
      console.log(err);
      //console.log(str);
      //let stream = wkhtmltopdf(str);
      //let blob = stream.toBlob('application/pdf');
      wkhtmltopdf(str).pipe(new Base64Encode()).pipe(res);
    });
  }
}

module.exports = invoiceCreate;
