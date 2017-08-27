export class LoopBackAdaptor {

  loopbackAdaptor = new ej.ODataAdaptor().extend({

    init: function (adaptorOptions) {

      if (adaptorOptions) {
        if (adaptorOptions.requestType) {
          this.options.requestType = adaptorOptions.requestType
        }
      }
    },

    options: {
      requestType: "get",
      accept: "application/json; charset=utf-8",
      sortBy: "order",
      select: "fields",
      skip: "skip",
      group: "group",
      take: "limit",
      search: "search",
      count: "count",
      where: "where",
      aggregates: "aggregates"
    },
    loopBackodBiOperator: {
      "<": " lt ",
      ">": " gt ",
      "<=": " lte ",
      ">=": " gte ",
      "==": "=",
      "=": "=",
      "!=": " neq ",
      "lessthan": " lt ",
      "lessthanorequal": " lte ",
      "greaterthan": " gt ",
      "greaterthanorequal": " gt ",
      "equal": " = ",
      "notequal": " neq ",
      "like": " like ",
      "notnull": " notnull ",
      "isnull": " null ",
      "IS NOT NULL": " notnul ",
      "IS NULL": " null ",
      "contains": " in ",
      "endswith": " like% ",
      "startswith": " %like "
    },


    beforeSend: function (dm, request, settings) {

      settings.type = "GET";
      let dataObj = JSON.parse(settings.data);

      delete dataObj.count;
      delete dataObj.limit;
      delete dataObj.skip;
      if (!isEmpty(dataObj)) {
        let data = convertData(dataObj)
        let jsonStr =JSON.stringify(data)
        let params = '?' + 'filter=' + encodeURIComponent(jsonStr)
        settings.url = settings.url + params
      } else {
        console.log('no params')
      }

    },

    onPredicate: function (pred, query, requiresCast) {
      //   query._fromTable ="contact"
      let returnValue = "",
        operator, guid,
        val = pred.value,
        type = typeof val,
        field = this._p(pred.field);
      //field = field.replace(/^(|\)$/g, '');
      if (val instanceof Date) {
        val = "datetime'" + p.replacer(val).toJSON() + "'";
      }

      operator = this.loopBackodBiOperator[pred.operator];
      if (operator) {
        returnValue += field;
        returnValue += operator;
        if (guid)
          returnValue += guid;
        return returnValue + val;
      }

      operator = this.loopBackUniOperator[pred.operator];

      if (!operator || type !== "string") return "";

      returnValue += field;
      returnValue += operator + "(";

      if (guid) returnValue += guid;
      returnValue += val + ")";

      return returnValue
    },
    processResponse: function (result, ds, query, xhr, request, changes) {

      let data = {result: result.rows, count: result.count};
      return data

    },
    insert: function (dm, data, tableName, query) {
      tableName = tableName || query._fromTable
      let records = [];
      records.push(data);
      let expectedData = {resource: records};
      return {
        action: "insert",
        url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : ''),
        data: JSON.stringify(expectedData)
      }
    },
    remove: function (dm, keyField, value, tableName, query) {
      tableName = tableName || query._fromTable
      return {
        action: "remove",
        type: "DELETE",
        url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '/' + value
      };
    },
    update: function (dm, keyField, value, tableName, query) {
      tableName = tableName || query._fromTable
      return {
        action: "update",
        type: "PUT",
        url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '/' + value[keyField],
        data: JSON.stringify(value),
        accept: this.options.accept
      };
    },
    onCount: function (e) {
      return e === true ? true : "";
    },

  });

  constructor() {
    this.syncfusiondmSymbols = {};
    this.fnOperators = {}

    ej.data.fnOperators.in = function (actual, expected, ignoreCase) {
      if (ignoreCase)
        return (actual) && "IN" && (expected);

      return actual > expected;
    };

    ej.data.fnOperators.like = function (actual, expected, ignoreCase) {
      if (ignoreCase)
        return (actual) && "LIKE" && (expected);

      return actual > expected;
    };
    ej.data.fnOperators.notin = function (actual, expected, ignoreCase) {
      if (ignoreCase)
        return (actual) && "NOT IN " && (expected);

      return actual > expected;
    };

    $.extend(ej.data.operatorSymbols, this.syncfusiondmSymbols.operatorSymbols);

  }

  static isNull(val) {
    return val === undefined || val === null;
  }

}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function convertData(data) {
  //loopBack
  // {property: {op: value}}
  //{title: {like: 'M.-st'}}

  //in
  //{where: {id: {inq: [123, 234]}}},

  //SF
  //{fields: "lastName", where: "lastName in asdf", order: "lastName"}


  //Equal
  let obj = data
  let str = obj.where;


  let arry = str.split('=');
let trimmed = trimArray(arry)
  let converted = {[arry[0]]:arry[1]};

  let result = {where: converted};

  console.log(result);

  return result
}

function trimArray(arr)
{

  for(let i=0;i<arr.length;i++)
  {
    arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  return arr;
}



// var str = JSON.stringify({data)
// var test = str.replace('=',':')
// var test2 = JSON.parse(test)
//

//let dataObj = JSON.parse(settings.data);

// let obj = {};
// let clause = {};
// let str = data.filter;
//console.log(data)

// where = str.split(',');
// clause.where[0] = where[1];
// obj.where = {where};
//
// console.log(obj)


// beforeSend: function (dm, request, settings) {

//where, include, order, offset, limit,skip,fields

//   let queryString;
//   let urlParams
//   let url = settings.url;
//   let myobj = {}
//
//   let hasParams = url.includes('?');
//   if (hasParams === true) {
//     queryString = url.substr(url.indexOf("?") + 1)
//     if (queryString) {
//       urlParams = new URLSearchParams(queryString);
//       let arry = [];
//
//       urlParams.delete('count')
//       for (const [key, value] of urlParams) {
//         myobj[key] = value
//       }
//     }
//   }
//
//   let filter = {}
//   filter.where = myobj
//   let json = JSON.stringify(filter)
// }
