const express = require('express');
const reports = express.Router();
const User = require('../models/user');
const path = require('path');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');

reports.get('/account/reports', (req, res)=>{
  res.sendFile(path.join(__dirname, "../public", "reports.html"));
})

reports.get('/account/reports/:id', async (req, res)=>{
  const id = req.params.id;
  let SN = 0;
  let total_sale = 0;
  let total_exp = 0;
  let net = 0;
  const user = await User.findById(req.session.user);
  const doc = new PDFDocument();
  for (var i=0; i<user.dailyRecords.length; i++) {
    if (user.dailyRecords[i]._id.toString()===id.toString()) {
      SN = i;
    }
  }
  let FileName = `Records of ${user.dailyRecords[SN].title}`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${FileName}.pdf"`);
  doc.pipe(res);
  //Adding header content
  doc.font('Times-Bold').fontSize(25).text(`${FileName}`,{
    underline: true,
  align: 'center'});
   doc.moveDown(); 

  doc.font('Times-Bold').fillColor('green').fontSize(20).text("SALE(S)",{
  align: 'center'});
  doc.moveDown();
  if (user.dailyRecords[SN].sales.length===0) {
        doc.font('Times-Italic').fillColor('red').fontSize(18).text("No Sales Record done at all",{
  align: 'left'});
  doc.moveDown();
  }
  else {
//Sales loop starts here
for (var s=0; s<user.dailyRecords[SN].sales.length; s++) {
  total_sale += user.dailyRecords[SN].sales[s].cost;
    doc.fillColor('green').fontSize(12).text(`${s+1}-----`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`Name:
     ${user.dailyRecords[SN].sales[s].name}`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`ID:
     ${user.dailyRecords[SN].sales[s].id}`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`Quantity:
     ${user.dailyRecords[SN].sales[s].qn}`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`Cost:
     ${user.dailyRecords[SN].sales[s].cost}`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`Recorded At:
     ${user.dailyRecords[SN].sales[s].createdAt}`,{
  align: 'left'});
  doc.moveDown();
}
doc.font('Times-Bold').fillColor('brown').fontSize(18).text("------------------",{
  align: 'center'});
  doc.moveDown();
  }


  /*
  EXPENSE PART
  */
 doc.fillColor('red').fontSize(20).text("EXPENSE(S)",{
  align: 'center'});
  doc.moveDown();
  if (user.dailyRecords[SN].expense.length===0) {
        doc.font('Times-Italic').fillColor('red').fontSize(18).text("No Expense Record done at all",{
  align: 'center'});
  doc.moveDown();
  }
  else {
//Sales loop starts here
for (var s=0; s<user.dailyRecords[SN].expense.length; s++) {
  total_exp += user.dailyRecords[SN].expense[s].cost;
    doc.font('Times-Roman').fillColor('green').fontSize(12).text(`${s+1}-----`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`Title:
     ${user.dailyRecords[SN].expense[s].title}`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`Cost:
     ${user.dailyRecords[SN].expense[s].cost}`,{
  align: 'left'});
  doc.moveDown();
  doc.font('Times-Roman').fillColor('black').fontSize(13).text(`Recorded At:
     ${user.dailyRecords[SN].expense[s].createdAt}`,{
  align: 'left'});
  doc.moveDown();
}
doc.font('Times-Bold').fillColor('brown').fontSize(18).text("------------------",{
  align: 'center'});
  doc.moveDown();
  }
  
doc.font('Times-Roman');
    doc.font('Times-Bold').fillColor('green').fontSize(20).text(`Total Sales: ${total_sale}`,{
  align: 'left'});
  doc.moveDown();
    doc.fillColor('red').fontSize(20).text(`Total Expenses: ${total_exp}`,{
  align: 'left'});
doc.moveDown();
net = total_sale - total_exp;
  if (total_exp>total_sale) {
    doc.fillColor('red').fontSize(20).text(`NET: ${net}`,{
  align: 'right'});
    }
    else {
    doc.fillColor('green').fontSize(20).text(`NET: ${net}`,{
  align: 'right'});
    }
  doc.end();
})

module.exports = reports;