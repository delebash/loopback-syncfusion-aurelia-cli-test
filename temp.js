//Order/Limit

//{order: 'price DESC',limit: 3}
//{limit: 10, skip: 0},


//Equal
//{where: {property: value}}


//Like
//{title: {like: 'M.-st'}}

//In
//{where: {id: {inq: [123, 234]}}},



// convertToQueryString: function (req, query, dm) {
//   let operator,guid ,val,field,data;
//
//   val = pred.value;
//   field = this._p(pred.field);
//   guid = ej.isGUID(val);
//
//   if (val instanceof Date) {
//     console.log('date');
//     val = "datetime'" + p.replacer(val).toJSON() + "'";
//   } else if (guid) {
//     console.log('guid');
//   } else {
//     console.log('string');
//     operator = this.loopbackOperators[pred.operator];
//     if (operator) {
//       returnValue += field;
//       returnValue += operator;
//     } else {
//       console.log('invalid operator');
//     }
//   }
//
//
//   if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1){
//     return "?" + $.param(data);
//
//   }else {
//     return $.param(data);
//   }
// },




settings.type = "GET";

jsonStr= {"where": {"lastName": {"like": "B.*"}}};
let params = '?' + 'filter=' + jsonStr;
// let params = '?' + 'filter=' + encodeURIComponent(jsonStr)
settings.url = settings.url + params
//{where: {lastName: {like.*': 'B.*'}}};
// let dataObj =
//   //let dataObj = JSON.parse(settings.data);
//   jsonStr= {"where": {"lastName": {"like": "B.*"}}};
//   delete dataObj.count;
//   delete dataObj.limit;
//   delete dataObj.skip;
//   if (!isEmpty(dataObj)) {
//     //let data = convertData(dataObj)
//     let jsonStr = JSON.stringify(dataObj);
//     jsonStr= {"where": {"lastName": {"like": "B.*"}}};
//     let params = '?' + 'filter=' + jsonStr;
//    // let params = '?' + 'filter=' + encodeURIComponent(jsonStr)
//     settings.url = settings.url + params
//   } else {
//     console.log('no params')
//   }
