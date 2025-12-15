'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { LetterPdfDocument } from './letter-pdf'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  senderName: string
  senderAddress: string
  receiverName: string
  receiverAddress: string
  content: string
}

export default function PdfDownloadButton(props: Props) {
    const [isClient, setIsClient] = useState(false)
    
    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return <Button disabled variant="outline">準備中...</Button>

    return (
        <PDFDownloadLink
            document={<LetterPdfDocument {...props} />}
            fileName={`存證信函_${props.senderName}_to_${props.receiverName}.pdf`}
        >
            {({ loading }) => (
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" disabled={loading}>
                    <Download className="w-4 h-4" />
                    {loading ? '正在生成 PDF...' : '下載正式 PDF (中華郵政格式)'}
                </Button>
            )}
        </PDFDownloadLink>
    )
}
