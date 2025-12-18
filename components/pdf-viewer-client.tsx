'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { LetterPdfDocument } from './letter-pdf';

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading PDF Viewer...</p>,
});

export function PdfViewerClient() {
   // Mock Data
   const mockProps = {
     senderName: "王小明",
     senderAddress: "台北市信義區信義路五段7號 (台北101)",
     receiverName: "李大同",
     receiverAddress: "高雄市苓雅區四維三路2號",
     // Generate enough content to test 2 pages (approx 200+ chars)
     content: "敬啟者：\n\n一、台端於民國112年1月1日向本人承租位於台北市大安區和平東路二段之房屋，約定每月租金新台幣三萬元整，租期一年。\n\n二、惟台端自民國112年3月起即未按時繳納租金，屢經本人以口頭及訊息催討，台端均置之不理，迄今已積欠租金達三個月，共計新台幣九萬元整。\n\n三、按民法第440條規定，承租人租金支付有遲延者，出租人得定相當期限催告承租人支付租金，如於期限內不為支付，出租人得終止契約。今特以此函通知，請台端於文到七日內，將積欠之租金全數匯入本人指定帳戶（銀行代碼：000，帳號：1234567890），以利後續租約履行。\n\n四、若台端逾期仍未履行，本人將依法終止租約，並請求遷讓房屋及給付欠租，屆時一切衍生之訴訟費用及相關損失，概由台端負責。\n\n五、希勿自誤，以免訟累。\n\n(此處為測試換頁與網格對齊之填充文字，請忽略。)\n"
   };

   return (
     <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
       <h1 className="text-xl font-bold mb-4">PDF 版面測試頁</h1>
       <div className="w-full h-full border border-gray-300 shadow-lg bg-white">
         <PDFViewer width="100%" height="100%" className="h-full">
            <LetterPdfDocument {...mockProps} />
         </PDFViewer>
       </div>
     </div>
   );
}
