/* eslint-disable jsx-a11y/alt-text */
'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register font
// Ensure this path matches the public directory
Font.register({
  family: 'NotoSansTC',
  src: '/fonts/NotoSansTC-Regular.otf'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'NotoSansTC',
    fontSize: 10,
    position: 'relative',
  },
  // Main Border
  mainContainer: {
    borderWidth: 1,
    borderColor: 'black',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  // Header
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 5,
    fontFamily: 'NotoSansTC', 
    fontWeight: 'bold', // Note: OpenType font weight support might be limited
  },
  
  // Info Section (Top Box)
  infoSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    height: 140, // Fixed height for info
    flexDirection: 'row',
  },
  infoLeft: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  infoRight: {
    width: '85%',
    padding: 5,
    position: 'relative',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    width: 80,
    fontWeight: 'normal',
  },
  infoValue: {
    flex: 1,
  },
  stampBox: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8,
  },
  disclaimerText: {
    fontSize: 8,
    marginBottom: 5,
    textAlign: 'center',
  },

  // Grid Section
  gridSection: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  // Col Header Row (1-20)
  colHeaderRow: {
    flexDirection: 'row',
    height: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  // Row Container
  gridRow: {
    flexDirection: 'row',
    height: 48, // Adjusted to fit 10 rows in remaining space
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  // Row Label Column (一, 二...)
  rowLabelCol: {
    width: 25,
    borderRightWidth: 1,
    borderRightColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 9,
  },
  // Content Cells
  gridCell: {
    flex: 1, // Distribute evenly
    borderRightWidth: 1,
    borderRightColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCellLast: {
    borderRightWidth: 0,
  },
  
  // Footer Section
  footerSection: {
    height: 120,
    flexDirection: 'row',
  },
  footerLeft: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: 'black',
  },
  footerRight: {
    width: 100, // For stamps
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    lineHeight: 1.5,
  }
});

interface LetterPdfProps {
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  content: string;
}

// Helper to convert number to Chinese numeral for row headers
const toChineseNum = (num: number) => {
    const map = ['一','二','三','四','五','六','七','八','九','十'];
    return map[num] || '';
};

const processContent = (text: string, cols = 20, rowsPerPage = 10) => {
    const cleanText = text.replace(/[*_#]/g, '');
    const chars: string[] = [];
    
    // Simple processing: treat newlines as characters but maybe add spaces to fill line?
    // Chunghwa Post usually expects continuous text, but let's handle newlines by skipping to next line
    // to separate paragraphs visually.
    
    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        if (char === '\n') {
            const currentLineLen = chars.length % cols;
            if (currentLineLen > 0) {
                 const remaining = cols - currentLineLen;
                 for(let k=0; k<remaining; k++) chars.push('');
            }
        } else {
            chars.push(char);
        }
    }

    const rows: string[][] = [];
    for (let i = 0; i < chars.length; i += cols) {
        rows.push(chars.slice(i, i + cols));
    }
    
    const pages: string[][][] = [];
    for (let i = 0; i < rows.length; i += rowsPerPage) {
        pages.push(rows.slice(i, i + rowsPerPage));
    }
    if (pages.length === 0) pages.push([]);
    return pages;
};

export const LetterPdfDocument = ({ senderName, senderAddress, receiverName, receiverAddress, content }: LetterPdfProps) => {
    const pages = processContent(content);

    return (
        <Document>
            {pages.map((pageRows, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page}>
                    {/* Title outside main border */}
                    <Text style={styles.headerTitle}>郵 局 存 證 信 函 用 紙</Text>
                    
                    <View style={styles.mainContainer}>
                        {/* 1. INFO SECTION */}
                        <View style={styles.infoSection}>
                            {/* Left Side Labels: 副本 / 存證信函號 */}
                            <View style={styles.infoLeft}>
                                <Text style={{fontSize: 12}}>副</Text>
                                <Text style={{fontSize: 12}}>本</Text>
                                <View style={{height: 20}} />
                                <Text>存</Text>
                                <Text>證</Text>
                                <Text>信</Text>
                                <Text>函</Text>
                                <Text>第</Text>
                                <View style={{height: 10}} />
                                <Text>號</Text>
                            </View>
                            
                            {/* Right Side Info Fields */}
                            <View style={styles.infoRight}>
                                <Text style={styles.disclaimerText}>〈寄件人如為機關、團體、學校、公司、商號請加蓋單位圖章及法定代理人簽名或蓋章〉</Text>
                                
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>一、寄件人</Text>
                                    <View style={styles.infoValue}>
                                        <Text>姓名：{senderName}</Text>
                                        <Text>詳 細 地 址：{senderAddress}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>二、收件人</Text>
                                    <View style={styles.infoValue}>
                                        <Text>姓名：{receiverName}</Text>
                                        <Text>詳 細 地 址：{receiverAddress}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>三、副本收件人</Text>
                                    <View style={styles.infoValue}>
                                        <Text>姓名：</Text>
                                        <Text>詳 細 地 址：</Text>
                                    </View>
                                </View>
                                
                                <Text style={{fontSize: 8, marginTop: 5, textAlign: 'center'}}>〈本欄姓名、地址不敷填寫時，請另紙聯記〉</Text>
                                
                                <View style={styles.stampBox}>
                                    <Text>印</Text>
                                </View>
                            </View>
                        </View>

                        {/* 2. GRID SECTION */}
                        <View style={styles.gridSection}>
                            {/* Column Headers (1-20) */}
                            <View style={styles.colHeaderRow}>
                                <View style={[styles.rowLabelCol, {borderRightWidth: 1}]}>
                                    <Text style={{fontSize: 8}}>格行</Text>
                                </View>
                                {Array.from({length: 20}).map((_, i) => (
                                    <View key={i} style={[styles.gridCell, i===19 ? styles.gridCellLast : {}]}>
                                        <Text style={{fontSize: 8}}>{i+1}</Text>
                                    </View>
                                ))}
                            </View>
                            
                            {/* Grid Rows */}
                            {Array.from({length: 10}).map((_, rIndex) => {
                                const rowData = pageRows[rIndex] || [];
                                return (
                                    <View key={rIndex} style={styles.gridRow}>
                                        {/* Row Label (Chinese Num) */}
                                        <View style={styles.rowLabelCol}>
                                            <Text>{toChineseNum(rIndex)}</Text>
                                        </View>
                                        
                                        {/* Cells */}
                                        {Array.from({length: 20}).map((_, cIndex) => (
                                            <View key={cIndex} style={[styles.gridCell, cIndex===19 ? styles.gridCellLast : {}]}>
                                                <Text style={{fontSize: 14}}>{rowData[cIndex] || ''}</Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })}
                        </View>

                        {/* 3. FOOTER SECTION */}
                        <View style={styles.footerSection}>
                            <View style={styles.footerLeft}>
                                <Text style={[styles.footerText, {marginBottom: 5}]}>
                                    本存證信函共 {pages.length} 頁，正本    份，副本    份
                                </Text>
                                <Text style={styles.footerText}>
                                    附件    張，存證費    元，
                                </Text>
                                <Text style={styles.footerText}>
                                    加具正本    份，存證費    元，
                                </Text>
                                <Text style={styles.footerText}>
                                    加具副本    份，存證費    元，合計      元。
                                </Text>
                                
                                <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-between'}}>
                                    <View>
                                       <Text style={styles.footerText}>經辦局</Text>
                                       <Text style={styles.footerText}>年  月  日證明</Text>
                                    </View>
                                    <View style={{borderBottomWidth: 1, width: 50}} />
                                    <View>
                                       <Text style={styles.footerText}>經辦員</Text>
                                       <Text style={styles.footerText}>主管</Text>
                                    </View>
                                    <View style={{borderWidth: 1, width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}><Text style={{fontSize: 8}}>印</Text></View>
                                </View>
                                
                                <View style={{marginTop: 5, borderTopWidth: 1, paddingTop: 2}}>
                                    <Text style={{fontSize: 8}}>
                                        一、存證信函需送交郵局辦理證明手續後始有效，自交寄之日起由郵局保存之副本，於三年期滿後銷燬之。
                                    </Text>
                                    <Text style={{fontSize: 8}}>
                                        二、如有修改應填註本欄並蓋用寄件人印章 (但塗改增刪每頁至多不得逾二十字)。
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.footerRight}>
                                <Text style={{fontSize: 12, marginBottom: 20}}>黏 貼</Text>
                                <Text style={{fontSize: 12}}>郵 票</Text>
                                <Text style={{fontSize: 12}}>或</Text>
                                <Text style={{fontSize: 12}}>郵 資 券</Text>
                                <Text style={{fontSize: 12, marginTop: 20}}>處</Text>
                            </View>
                        </View>
                    </View>
                    
                     <Text style={{ position: 'absolute', bottom: 10, right: 30, fontSize: 10 }}>
                        第 {pageIndex + 1} 頁
                    </Text>
                    
                    {/* Center Fold Mark / Glue Area Labels ? */}
                </Page>
            ))}
        </Document>
    );
};
