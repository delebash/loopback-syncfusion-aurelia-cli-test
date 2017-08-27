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
    loopBackOperators: {
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
      "equal": "=",
      "notequal": " neq ",
      "like": "like",
      "notnull": " notnull ",
      "isnull": " null ",
      "IS NOT NULL": " notnul ",
      "IS NULL": " null ",
      "contains": " in ",
      "endswith": " like% ",
      "startswith": "%like"
    },


    convertToQueryString: function (req, query, dm) {

      let guid, paramFieldName, params, operator, paramVal,
        paramOperator, count, limit, skip, ignoreCase, isComplex
//Like
//where{:{title: {like: 'M.-st'}}

      let data = {};
      let objWhere = {};
      count = req.count;
      skip = req.skip;
      limit = req.limit;

      params = query.queries[0];
      ignoreCase = params.ignoreCase;
      isComplex = params.isComplex;

      paramFieldName = params.e.field;

      if (paramFieldName) {
        paramOperator = params.e.operator;
        paramVal = params.e.value;
        guid = ej.isGUID(paramVal);

        if (paramVal instanceof Date) {
          console.log('date');
          val = "datetime'" + p.replacer(val).toJSON() + "'";
        } else if (guid) {
          console.log('guid');
        } else {
          console.log('string');

          operator = this.loopBackOperators[paramOperator];
          if (operator) {
            if (operator == '=') {
              data = {[paramFieldName]: paramVal};
            } else
              data[paramFieldName] = {[operator]: paramVal};
            delete data.count;
            objWhere.where=data
          } else {
            console.log('invalid operator');
          }
        }
      } else {
        objWhere = req
      }
      delete objWhere.count
    var test =   $.param(objWhere);

      if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1)
        return $.param(objWhere);
      if (objWhere.where){
        return "?filter=" + $.param(objWhere);
      }
      return "?" + $.param(objWhere);
    },


     beforeSend: function (dm, request, settings) {
      console.log(settings.url)
    //
    //   settings.type = "GET";
    //   let dataObj = JSON.parse(settings.data);
    //
    //   delete dataObj.count;
    //   delete dataObj.limit;
    //   delete dataObj.skip;
    //   if (!isEmpty(dataObj)) {
    //     let data = convertData(dataObj)
    //     let jsonStr =JSON.stringify(data)
    //     let params = '?' + 'filter=' + encodeURIComponent(jsonStr)
    //     settings.url = settings.url + params
    //   } else {
    //     console.log('no params')
    //   }
    //
    },


    processResponse: function (result, ds, query, xhr, request, changes) {

      let data = {result: result.rows, count: result.count};
      return data

    }

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

var filterQueryLists = function (queries, singles) {
  var filtered = queries.filter(function (q) {
    return singles.indexOf(q.fn) !== -1;
  }), res = {};
  for (var i = 0; i < filtered.length; i++) {
    if (!res[filtered[i].fn])
      res[filtered[i].fn] = filtered[i].e;
  }
  return res;
};
var callAdaptorFunc = function (obj, fnName, param, param1) {
  if (obj[fnName]) {
    var res = obj[fnName](param, param1);
    if (!isNull(res)) param = res;
  }
  return param;
};
var filterQueries = function (queries, name) {
  return queries.filter(function (q) {
    return q.fn === name;
  }) || [];
};
var getValue = function (value, inst) {
  if (typeof value === "function")
    return value.call(inst || {});
  return value;
}
var isNull = function (val) {
  return val === undefined || val === null;
};
