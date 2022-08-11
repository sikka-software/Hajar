/* eslint-disable @typescript-eslint/naming-convention */
import wkhtmltopdf from "wkhtmltopdf";
import ejs from "ejs";
import fs from "fs";
import { Transaction, ICard, IPacks, IPackUsers, IUser, IAddresses, ITransactions } from "../models/qawaim";
import moment from "moment";
import { Base64Encode } from "base64-stream";
import QRCode from "qrcode";
import { formatCurrency, getPrice } from "./helpers";

export default async function createInvoice (transactionID: string, res: any, lang: string, isMail: boolean, isWallet: boolean): Promise<void> {
  const dataUrlString: string = Buffer.from(`${String(transactionID)}_${String(lang)}_${String(isWallet)}`).toString("base64");
  const urlQrcode: string = await QRCode.toDataURL(`${String(process.env.QAWAIM_USER_PORTAL_URL)}/invoice/${String(dataUrlString)}`);
  console.log(urlQrcode);
  const transaction = await Transaction.findOne({
    _id: transactionID
  })
    .populate<{ card: ICard }>("card")
    .populate<{ pack: IPacks }>("pack")
    .populate<{ pack_user: IPackUsers }>("pack_user")
    .populate<{ user: IUser }>("user")
    .populate<{ billing_address: IAddresses }>("billing_address")
    .populate<{ parent_transaction: ITransactions }>("parent_transaction")
    .exec();
  let price: any;
  let cycletexteinvoice;
  let pack_subtitle_text;
  let pack_title_text;
  let pack_price_value;

  if (isWallet === false) {
    price = getPrice(
      transaction?.pack_user.recurring,
      transaction?.currency,
      transaction?.pack
    );
    const cycle = transaction?.pack_user.recurring;

    if (cycle === "monthly") {
      if (lang === "ar") {
        cycletexteinvoice = "شهريا";
      } else {
        cycletexteinvoice = "(Monthly)";
      }
    } else if (cycle === "3-months") {
      if (lang === "ar") {
        cycletexteinvoice = "3 أشهر";
      } else {
        cycletexteinvoice = "(3 Months)";
      }
    } else if (cycle === "6-months") {
      if (lang === "ar") {
        cycletexteinvoice = "6 أشهر";
      } else {
        cycletexteinvoice = "(6 Months)";
      }
    } else {
      if (lang === "ar") {
        cycletexteinvoice = "سنويا";
      } else {
        cycletexteinvoice = "(Annually)";
      }
    }
    pack_title_text =
      lang === "ar"
        ? String(transaction?.pack.title_ar) + "-" + String(cycletexteinvoice)
        : String(transaction?.pack.title) + "-" + String(cycletexteinvoice);
    pack_subtitle_text =
      lang === "ar" ? String(transaction?.pack.subtitle_ar) : String(transaction?.pack.subtitle);
    pack_price_value = formatCurrency(price, transaction?.currency);
  }
  if (isWallet === true) {
    price = ((transaction?.amount) != null) ? transaction?.amount : 0 as number;
    pack_title_text = lang === "ar" ? "مبلغ المحفظة" : "Wallet Amount";
    pack_price_value = formatCurrency(transaction?.amount, transaction?.currency);
  }

  const data = {
    invoice_lang: lang,
    invoice_company: {
      name: "Sikka Software Est",
      address: "Ash Shati Ash Sharqi, Dammam. Eastern Region, Saudi Arabia",
      phone: "",
      email: "contact@qawaim.app"
    },
    invoice_customer: {
      full_name:
        String(transaction?.billing_address.first_name) + " " + String(transaction?.billing_address.last_name),
      address:
        String(transaction?.billing_address.address_line_1) +
        " " +
        String(transaction?.billing_address.address_line_2) +
        " " +
        String(transaction?.billing_address.city) +
        " " +
        String(transaction?.billing_address.zip_code) +
        " " +
        String(transaction?.billing_address.state) +
        "," +
        String(transaction?.billing_address.country),
      email: transaction?.billing_address.email
    },
    invoice_data: {
      qrCodeURL: urlQrcode,
      invoice_id: "#" + String(transaction?.invoice_id),
      date_invoice: moment(new Date((transaction?.createdAt !== undefined) ? transaction?.createdAt : "")).format(
        lang === "ar" ? "YYYY/MM/DD" : "DD/MM/YYYY"
      ),
      date_due: moment(new Date((transaction?.updatedAt !== undefined) ? transaction?.updatedAt : "")).format(
        lang === "ar" ? "YYYY/MM/DD" : "DD/MM/YYYY"
      ),
      pack_title: pack_title_text,
      pack_subtitle: pack_subtitle_text,
      pack_price: pack_price_value
    },
    invoice_translate: {
      invoice: lang === "ar" ? "فاتورة " : "INVOICE ",
      invoice_to: lang === "ar" ? "فاتورة إلى:" : "INVOICE TO:",
      date_invoice: lang === "ar" ? "تاريخ الفاتورة: " : "Date of Invoice: ",
      date_due: lang === "ar" ? "تاريخ الدفع: " : "Due Date: ",
      table: {
        description: lang === "ar" ? "الباقة" : "DESCRIPTION",
        unit_price: lang === "ar" ? "سعر الوحدة" : "UNIT PRICE",
        quantity: lang === "ar" ? "كمية" : "QUANTITY",
        total_product: lang === "ar" ? "المجموع" : "TOTAL",
        subtotal: lang === "ar" ? "المجموع الفرعي" : "SUBTOTAL",
        grandtotal: lang === "ar" ? "المبلغ الإجمالي" : "GRAND TOTAL"
      },
      thanks: lang === "ar" ? "شكرا لك!" : "Thank you!",
      footer:
        lang === "ar"
          ? "تم إنشاء الفاتورة على جهاز كمبيوتر وهي صالحة بدون التوقيع والختم."
          : "Invoice was created on a computer and is valid without the signature and seal.",
      notice: lang === "ar" ? "تنويه:" : "NOTICE:",
      notice_text:
        lang === "ar"
          ? "سيتم فرض رسوم تمويل بنسبة 1.5٪ على الأرصدة غير المدفوعة بعد 30 يومًا."
          : "A finance charge of 1.5% will be made on unpaid balances after 30 days."
    }
  };
  if (isMail === true) {
    ejs.renderFile(
      "template/invoice/tpl-invoice.ejs",
      data,
      {},
      function (err, str) {
        console.log(err);
        console.log(str);
        wkhtmltopdf(str).pipe(
          fs.createWriteStream(
            `invoices/invoice-${String(transaction?.invoice_id)}.pdf`,
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
        // console.log(str);
        // let stream = wkhtmltopdf(str);
        // let blob = stream.toBlob("application/pdf");
        wkhtmltopdf(str).pipe(new Base64Encode()).pipe(res);
      }
    );
  }
}