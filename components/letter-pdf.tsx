/* eslint-disable jsx-a11y/alt-text */
'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register font
// Ensure this path matches the public directory
/*
Font.register({
  family: 'NotoSansTC',
  src: '/fonts/NotoSansTC-Regular.otf'
});
*/


Font.register({
  family: 'TW-Kai-98_1',
  src: '/fonts/TW-Kai-98_1.ttf' // 這裡是指向 public 資料夾的相對路徑
});

const styles = StyleSheet.create({
  page: {
    paddingTop:30,
    paddingLeft:70,
    paddingRight:30,
    fontFamily: 'TW-Kai-98_1',
    fontSize: 10,
    position: 'relative',
  },
  // Main Border
  mainContainer: {
    borderWidth: 0.5,
    borderColor: 'black',
    height: '85%',
    display: 'flex',
    flexDirection: 'column',
  },
  // Header
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 5,
    fontFamily: 'TW-Kai-98_1', 
    fontWeight: 'bold', // Note: OpenType font weight support might be limited
  },
  
  // Info Section (Top Box)
  infoSection: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
    height: 120, // Fixed height for info
    flexDirection: 'row',
  },
  infoLeft: {
    width: '35%',
    borderRightWidth: 0.5,
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
    fontSize: 8
  },
  infoLabel: {
    width: 60,
    fontWeight: 'normal',
    fontSize: 8
  },
  infoValue: {
    flex: 1,
  },
  stampBox: {
    position: 'absolute',
    top: 18,
    right: 45,
    width: 15,
    height: 15,
    borderWidth: 0.5,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8
  },
  stampBox1: {
    width: 15,
    height: 15,
    borderWidth: 0.5,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8
  },
  disclaimerText: {
    fontSize: 7,
    marginBottom: 5,
    textAlign: 'center',
  },

  // Grid Section
  gridSection: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },
  // Col Header Row (1-20)
  colHeaderRow: {
    flexDirection: 'row',
    height: 25,
    borderBottomWidth: 0.8,
    borderTopWidth: 0.5,
    borderBottomColor: 'black'
  },
  // Row Container
  gridRow: {
    flexDirection: 'row',
    height: 40, // Adjusted to fit 10 rows in remaining space
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },
  // Row Label Column (一, 二...)
  rowLabelCol: {
    width: 25,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 9,
  },
  // Content Cells
  gridCell: {
    flex: 1, // Distribute evenly
    borderRightWidth: 0.8,
    borderRightColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCellLast: {
    borderRightWidth: 0.7,
  },
  
  // Footer Section
  footerSection: {
    height: 200,
    flexDirection: 'row',
    borderColor:'black',
    borderWidth:0.1,
    borderTopWidth:0  
  },
  footerLeft: {
    flex: 1,
    padding: 0,
    margin: 0,
    borderRightWidth: 0.5,
    borderRightColor: 'black',
    borderWidth:0.5
  },
  footerRight: {
    width: 100, // For stamps
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:0.5,
    borderColor:'black'
  },
  footerText: {
    fontSize: 9,
    lineHeight: 1.5,
    fontWeight: 'bold'
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
                    {/*正副本字樣 */}
                    <View style={{position:'absolute',flexDirection:'column' ,top:70,left:30, width: 200, height: 200}}>
                      <Text style={{fontSize: 12}}>副　正</Text>
                      <Text style={{fontSize: 12}}>　</Text>
                      <Text style={{fontSize: 12}}>　本　</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        {/* 1. INFO SECTION */}
                        <View style={styles.infoSection}>
                            {/* Left Side Labels: 副本 / 存證信函號 */}
                            <View style={styles.infoLeft}>
                                <Text style={{fontSize: 12}}>　　　　　郵  局</Text>
                                <View style={{height: 20}} />
                                <Text style={{textAlign:'left',paddingLeft: 0}}>存證信函第　　　　　　號</Text>
                                <Text></Text>
                            </View>
                            
                            {/* Right Side Info Fields */}
                            <View style={styles.infoRight}>
                                <Text style={styles.disclaimerText}>〈寄件人如為機關、團體、學校、公司、商號請加蓋單位圖章及法定代理人簽名或蓋章〉</Text>
                                
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>一、寄件人</Text>
                                    <View style={styles.infoValue}>
                                        <Text>姓名：{senderName}</Text>
                                <View style={{height: 5}} />
                                        <Text>詳 細 地 址：{senderAddress}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>二、收件人</Text>
                                    <View style={styles.infoValue}>
                                        <Text>姓名：{receiverName}</Text>
                                <View style={{height: 5}} />
                                        <Text>詳 細 地 址：{receiverAddress}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>三、副本收件人</Text>
                                    <View style={styles.infoValue}>
                                        <Text>姓名：</Text>
                                <View style={{height: 5}} />
                                        <Text>詳 細 地 址：</Text>
                                    </View>
                                </View>
                                
                                <Text style={{fontSize: 8, marginTop: 5, textAlign: 'left'}}>〈本欄姓名、地址不敷填寫時，請另紙聯記〉</Text>
                                
                                <View style={styles.stampBox}>
                                    <Text>印</Text>
                                </View>
                            </View>
                        </View>

                        {/* 2. GRID SECTION */}
                        <View style={styles.gridSection}>
                            {/* Column Headers (1-20) */}
                            <View style={styles.colHeaderRow}>
                                <View style={[styles.rowLabelCol, {borderRightWidth: 0.5}]}>
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
                                <Text style={[styles.footerText, {marginBottom: 1,paddingLeft:1}]}>
                                本存證信函共　　{pages.length} 頁，正本　　　　　份，存證費　　　　　　　元，
                                </Text>
                                <Text style={styles.footerText}>
                                　　　　　　　　　　　副本　　　　　份，存證費　　　　　　　元，
                                </Text> 
                                <Text style={styles.footerText}>
                                   　　　　　　　　　　　附件　　　　　張，存證費　　　　　　　元，
                                </Text>
                                <Text style={styles.footerText}>
                                   　　　　　　　　　加具正本　　　　　份，存證費　　　　　　　元，
                                </Text>
                                <Text style={styles.footerText}>
                                  　　　　　　　　　加具副本　　　　　份，存證費　　　　　　　元，合計　　　　　元。
                                </Text>
                                
                                <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-between'}}>
                                    <View>
                                       <Text style={styles.footerText}>　　經　　　　　　郵局</Text>
                                       <Text style={styles.footerText}>　　年　　月　　日證明正副本內容完全相同</Text>
                                    </View>
                                    
                                    <View style={{ width: 40,marginTop:-15}} >
                                    <View style={{borderColor:'#666666', borderWidth: 0.5, width: 40,height:40,borderRadius: 20,borderStyle:'dotted', justifyContent: 'center', alignItems: 'center'}} >
                                      <Text style={[styles.footerText, {color:'#666666'}]}>郵戳</Text>
                                    </View>
                                    </View>
                                    <View>
                                       <Text style={styles.footerText}>經辦員   </Text>
                                       <Text style={styles.footerText}>主管   </Text>
                                    </View>
                                    <View style={{borderWidth: 1, width: 20, height: 20, justifyContent: 'center', alignItems: 'center'}}><Text style={{fontSize: 8}}>印</Text></View>
                                    <Text> </Text>
                                </View>
                                 {/* 備註區塊 */}
                                <View style={{marginLeft:0,padding:0 , borderTopWidth: 0.5,height: 90,width:390,borderLeftWidth: 0,borderColor:"black"}}>
                                  <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'row'}}>
                                    <View style={{ width: 50, height: 90,borderRightWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
                                      <Text style={{fontSize: 12}}>備</Text>
                                      <Text style={{fontSize: 12}}>註</Text>
                                    </View>
                                    <View style={{  margin:0,paddingLeft:0 , width:'90%', height: 90, alignItems: 'flex-start'}}> 
                                       {/* 第一行 */}
                                      <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'column'}}>
                                        <Text style={[styles.footerText,{}]}>
                                        一、存證信函需送交郵局辦理證明手續後始有效，自交寄之日起由郵局保存之
                                        </Text>
                                        <Text style={[styles.footerText,{}]}>　　副本，於三年期滿後銷燬之。</Text>
                                    </View>
                                     {/* 第一行 end */}
                                     {/* 第二行要一個大View再包四個view */}
                                     <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'row'}}>
                                      {/* 第一個view */}
                                        <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                          <Text style={[styles.footerText, {}]}>
                                              二、在　　頁　　行第　　格下
                                          </Text>
                                            
                                        </View>
                                    
                                     {/* 第一個view end */}
                                     {/* 第二個view */}
                                        <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                          <Text style={[styles.footerText, {}]}>
                                              塗改
                                          </Text>
                                            <Text style={[styles.footerText,{}]}>
                                              增刪
                                          </Text>
                                        </View>
                                    
                                     {/* 第二個view end */}
                                     {/* 第三個view */}
                                        <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                          <Text style={[styles.footerText, {}]}>
                                            　　字　　　　
                                          </Text>
                                          <View style={styles.stampBox1}>
                                            <Text>印</Text>
                                          </View>
                                        </View>
                                    
                                     {/* 第三個view end */}
                                     {/* 第四個view */}
                                        <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                          <Text style={[styles.footerText,{}]}>
                                              如有修改應填註本欄並蓋用
                                          </Text>
                                            <Text style={[styles.footerText,{}]}>
                                              ( 寄件人印章,但塗改增刪 )
                                          </Text>
                                          <Text style={[styles.footerText,{}]}>
                                              每頁至多不得逾二十字。
                                          </Text>
                                        </View>
                                    
                                     {/* 第四個view end */}
                                    </View>
                                    {/* 第三行 */}
                                      <View style={{ marginLeft:0,paddingLeft:0 , flexDirection: 'column'}}>
                                        <Text style={[styles.footerText,{}]}>
                                        三 、每件 一式三份，用不脫色筆或打字機複寫，或書寫後複印、影印，每格限
                                        </Text>
                                        <Text style={[styles.footerText,{}]}>　　書一字，色澤明顯、字跡端正 。</Text>
                                    </View>
                                     {/* 第三行 end */}
                                    </View>
                                  </View>
                                   
                                </View>
                            </View>
                            <View style={styles.footerRight}>
                               <view style={{ flexDirection: 'row'}}>
                                
                              <view style={{borderWidth:1,borderTopWidth:0,borderLeftWidth:0, width: 50, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 12}}>黏</Text>
                              </view>
                                 <view style={{borderWidth: 1,borderTopWidth:0,borderLeftWidth:0, width: 50, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 12}}>貼</Text>
                              </view>
                              </view>

                               <view style={{borderBottomWidth: 0.8, flexDirection: 'column', width: 100, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 12}}>郵 票 或</Text>
                                <Text style={{fontSize: 12}}>郵 資 券</Text>
                               </view>
                               <View style={{borderWidth: 0.3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                               <view style={{borderWidth:0.3, flexDirection: 'row', width: 50, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 12, marginTop: 10}}>處</Text>
                               </view><view style={{borderWidth:0.3,borderLeftWidth:.7, flexDirection: 'row', width: 50, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 12, marginTop: 10}}> </Text>
                               </view>
                               </View>
                            </View>
                        </View>
                    </View>
                    
                     <Text style={{ position: 'absolute', bottom: 10, right: 30, fontSize: 10 }}>
                        第 {pageIndex + 1} 頁
                    </Text>
                    <View style={{flexDirection:'row' }}>
                      {/*騎縫郵戳1 */}
                        <View style={{borderWidth: .5,borderColor:'white' ,flexDirection:'column' ,paddingTop:0,left:120, width: 150, height:90,overflow:'hidden'}} >
                                    <View style={{bottom:-20,borderColor:'#666666', borderWidth: 1, width: 90,height:90,borderRadius: 45,borderStyle:'dotted', justifyContent: 'center', alignItems: 'center'}} >
                                      <Text style={[styles.footerText, {color:'#666666'}]}>騎縫郵戳</Text>
                                    </View>
                        </View>
                        {/*騎縫郵戳2 */}
                        <View style={{borderWidth: .5,borderColor:'white' ,flexDirection:'column' ,paddingTop:0,left:120, width: 150, height:90,overflow:'hidden'}} >
                                    <View style={{bottom:-20,borderColor:'#666666', borderWidth: 1, width: 90,height:90,borderRadius: 45,borderStyle:'dotted', justifyContent: 'center', alignItems: 'center'}} >
                                      <Text style={[styles.footerText, {color:'#666666'}]}>騎縫郵戳</Text>
                                    </View>
                        </View>
                    </View>
                    {/* Center Fold Mark / Glue Area Labels ? */}
                </Page>
            ))}
        </Document>
    );
};
