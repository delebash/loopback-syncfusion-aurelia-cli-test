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
      "lessthan": "lt",
      "lessthanorequal": "lte",
      "greaterthan": "gt",
      "greaterthanorequal": "gte",
      "equal": "=",
      "notequal": "neq",
      "like": "like",
      "IS NOT NULL": "notnul",
      "IS NULL": "null",
      "contains": "in",
      "endswith": "endswith",
      "startswith": "startswith"
    },


    onPredicate: function (pred, query, requiresCast) {

      let guid, paramFieldName, params, operator, paramVal,
        paramOperator, count, limit, skip, ignoreCase, isComplex

      let data = {};
      let objWhere = {};
//     count = query.count;
      //     skip = query.skip;
      //    limit = query.limit;

      params = pred;
      ignoreCase = params.ignoreCase;
      isComplex = params.isComplex;

      paramFieldName = params.field;
      paramVal = params.value;
      paramOperator = params.operator;;

      if (paramVal instanceof Date) {
        console.log('date');
        val = "datetime'" + p.replacer(val).toJSON() + "'";
      } else if (guid) {
        console.log('guid');
      } else {
        console.log('string');


        if (paramFieldName) {

          guid = ej.isGUID(paramVal);
          operator = this.loopBackOperators[paramOperator];

          if (operator) {

            if (operator == '=') {
              data = {[paramFieldName]: paramVal};
            }
            else if (operator == 'startswith' || operator == 'endswith') {
              // {"where": {"lastName": {"like": "B.*"}}};
              data[paramFieldName] = {'like': paramVal + '.*'};
            } else {
              //date: {gt: new Date('2014-04-01T18:30:00.000Z')}
              let myarry = [];
              myarry.push(paramVal)
              data[paramFieldName] = {gt: myarry};
            }
          }
          objWhere = data
        } else {
          return
        }
        //  id: {gt: 5)}
        // delete objWhere.count;
        // delete objWhere.skip;
        // delete objWhere.limit;

        let jsonStr = JSON.stringify(objWhere)
        let queryStr //= 'filter=' + jsonStr;

        return queryStr;
      }
    },

    processQuery: function (dm, query, hierarchyFilters) {
      var sorted = filterQueries(query.queries, "onSortBy"),
        grouped = filterQueries(query.queries, "onGroup"),
        filters = filterQueries(query.queries, "onWhere"),
        searchs = filterQueries(query.queries, "onSearch"),
        aggregates = filterQueries(query.queries, "onAggregates"),
        singles = filterQueryLists(query.queries, ["onSelect", "onPage", "onSkip", "onTake", "onRange"]),
        params = query._params,
        url = dm.dataSource.url, tmp, skip, take = null,
        op = this.options;

      var r = {
        sorted: [],
        grouped: [],
        filters: [],
        searches: [],
        aggregates: []
      };

      // calc Paging & Range
      if (singles["onPage"]) {
        tmp = singles["onPage"];
        skip = getValue(tmp.pageIndex, query);
        take = getValue(tmp.pageSize, query);
        skip = (skip - 1) * take;
      } else if (singles["onRange"]) {
        tmp = singles["onRange"];
        skip = tmp.start;
        take = tmp.end - tmp.start;
      }

      // Sorting
      for (var i = 0; i < sorted.length; i++) {
        tmp = getValue(sorted[i].e.fieldName, query);

        r.sorted.push(callAdaptorFunc(this, "onEachSort", {name: tmp, direction: sorted[i].e.direction}, query));
      }

      // hierarchy
      if (hierarchyFilters) {
        tmp = this.getFiltersFrom(hierarchyFilters, query);
        if (tmp)
          r.filters.push(callAdaptorFunc(this, "onEachWhere", tmp.toJSON(), query));
      }

      // Filters
      for (var i = 0; i < filters.length; i++) {
        r.filters.push(callAdaptorFunc(this, "onEachWhere", filters[i].e.toJSON(), query));

        for (var prop in r.filters[i]) {
          if (isNull(r[prop]))
            delete r[prop];
        }
      }

      // Searches
      for (var i = 0; i < searchs.length; i++) {
        tmp = searchs[i].e;
        r.searches.push(callAdaptorFunc(this, "onEachSearch", {
          fields: tmp.fieldNames,
          operator: tmp.operator,
          key: tmp.searchKey,
          ignoreCase: tmp.ignoreCase
        }, query));
      }

      // Grouping
      for (var i = 0; i < grouped.length; i++) {
        r.grouped.push(getValue(grouped[i].e.fieldName, query));
      }

      // aggregates
      for (var i = 0; i < aggregates.length; i++) {
        tmp = aggregates[i].e;
        r.aggregates.push({type: tmp.type, field: getValue(tmp.field, query)});
      }

      var req = {};
      req[op.from] = query._fromTable;
      if (op.expand) req[op.expand] = query._expands;
      req[op.select] = singles["onSelect"] ? callAdaptorFunc(this, "onSelect", getValue(singles["onSelect"].fieldNames, query), query) : "";
      req[op.count] = query._requiresCount ? callAdaptorFunc(this, "onCount", query._requiresCount, query) : "";
      req[op.search] = r.searches.length ? callAdaptorFunc(this, "onSearch", r.searches, query) : "";
      req[op.skip] = singles["onSkip"] ? callAdaptorFunc(this, "onSkip", getValue(singles["onSkip"].nos, query), query) : "";
      req[op.take] = singles["onTake"] ? callAdaptorFunc(this, "onTake", getValue(singles["onTake"].nos, query), query) : "";
      req[op.where] = r.filters.length || r.searches.length ? callAdaptorFunc(this, "onWhere", r.filters, query) : "";
      req[op.sortBy] = r.sorted.length ? callAdaptorFunc(this, "onSortBy", r.sorted, query) : "";
      req[op.group] = r.grouped.length ? callAdaptorFunc(this, "onGroup", r.grouped, query) : "";
      req[op.aggregates] = r.aggregates.length ? callAdaptorFunc(this, "onAggregates", r.aggregates, query) : "";
      req["param"] = [];

      // Params
      callAdaptorFunc(this, "addParams", {dm: dm, query: query, params: params, reqParams: req});

      // cleanup
      for (var prop in req) {
        if (isNull(req[prop]) || req[prop] === "" || req[prop].length === 0 || prop === "params")
          delete req[prop];
      }

      if (!(op.skip in req && op.take in req) && take !== null) {
        req[op.skip] = callAdaptorFunc(this, "onSkip", skip, query);
        req[op.take] = callAdaptorFunc(this, "onTake", take, query);
      }
      var p = this.pvt;
      this.pvt = {};


      let strWhere = this.convertToQueryString(req, query, dm);

      // {%22where%22:{%22lastName%22:{%22like%22:%22Bedecs.*%22}}
      //{%22where%22:{%22lastName%22:{%22like%22:%22B.*%22}}}
      let json = JSON.stringify(strWhere)
      return {
        type: "GET",
        data: strWhere,
        url: url,
        ejPvtData: p
      };
    },

    onComplexPredicate: function (pred, requiresCast) {
      var res = [];
      for (var i = 0; i < pred.predicates.length; i++) {
        res.push("(" + this.onEachWhere(pred.predicates[i], requiresCast) + ")");
      }
      return res.join(" " + pred.condition + " ");
    },
    onWhere: function (filters) {
      if (this.pvt.searches)
        filters.push(this.onEachWhere(this.pvt.searches, null, true));

      return filters.join(" and ");
    },
    onEachSearch: function (e) {
      if (e.fields.length === 0)
        throwError("Query() - Search : oData search requires list of field names to search");

      var filter = this.pvt.searches || [];
      for (var i = 0; i < e.fields.length; i++) {
        filter.push(new ej.Predicate(e.fields[i], e.operator, e.key, e.ignoreCase));
      }
      this.pvt.searches = filter;
    },
    onSearch: function (e) {
      this.pvt.searches = ej.Predicate.or(this.pvt.searches);
      return "";
    },
    onEachSort: function (e) {
      var res = [];
      if (e.name instanceof Array) {
        for (var i = 0; i < e.name.length; i++)
          res.push(this._p(e.name[i]));
      } else {
        res.push(this._p(e.name) + (e.direction === "descending" ? " desc" : ""));
      }
      return res.join(",");
    },
    onSortBy: function (e) {
      return e.reverse().join(",");
    },
    onGroup: function (e) {
      this.pvt.groups = e;
      return "";
    },
    onSelect: function (e) {
      for (var i = 0; i < e.length; i++)
        e[i] = this._p(e[i]);

      return e.join(',');
    },
    onAggregates: function (e) {
      this.pvt.aggregates = e;
      return "";
    },
    onCount: function (e) {
      return e === true ? "allpages" : "";
    },



    processQuery: function (dm, query, hierarchyFilters) {
      var sorted = filterQueries(query.queries, "onSortBy"),
        grouped = filterQueries(query.queries, "onGroup"),
        filters = filterQueries(query.queries, "onWhere"),
        searchs = filterQueries(query.queries, "onSearch"),
        aggregates = filterQueries(query.queries, "onAggregates"),
        singles = filterQueryLists(query.queries, ["onSelect", "onPage", "onSkip", "onTake", "onRange"]),
        params = query._params,
        url = dm.dataSource.url, tmp, skip, take = null,
        op = this.options;

      var r = {
        sorted: [],
        grouped: [],
        filters: [],
        searches: [],
        aggregates: []
      };

      // calc Paging & Range
      if (singles["onPage"]) {
        tmp = singles["onPage"];
        skip = getValue(tmp.pageIndex, query);
        take = getValue(tmp.pageSize, query);
        skip = (skip - 1) * take;
      } else if (singles["onRange"]) {
        tmp = singles["onRange"];
        skip = tmp.start;
        take = tmp.end - tmp.start;
      }

      // Sorting
      for (var i = 0; i < sorted.length; i++) {
        tmp = getValue(sorted[i].e.fieldName, query);

        r.sorted.push(callAdaptorFunc(this, "onEachSort", { name: tmp, direction: sorted[i].e.direction }, query));
      }

      // hierarchy
      if (hierarchyFilters) {
        tmp = this.getFiltersFrom(hierarchyFilters, query);
        if (tmp)
          r.filters.push(callAdaptorFunc(this, "onEachWhere", tmp.toJSON(), query));
      }

      // Filters
      for (var i = 0; i < filters.length; i++) {
        r.filters.push(callAdaptorFunc(this, "onEachWhere", filters[i].e.toJSON(), query));

        for (var prop in r.filters[i]) {
          if (isNull(r[prop]))
            delete r[prop];
        }
      }

      // Searches
      for (var i = 0; i < searchs.length; i++) {
        tmp = searchs[i].e;
        r.searches.push(callAdaptorFunc(this, "onEachSearch", {
          fields: tmp.fieldNames,
          operator: tmp.operator,
          key: tmp.searchKey,
          ignoreCase: tmp.ignoreCase
        }, query));
      }

      // Grouping
      for (var i = 0; i < grouped.length; i++) {
        r.grouped.push(getValue(grouped[i].e.fieldName, query));
      }

      // aggregates
      for (var i = 0; i < aggregates.length; i++) {
        tmp = aggregates[i].e;
        r.aggregates.push({ type: tmp.type, field: getValue(tmp.field, query) });
      }

      var req = {};
      req[op.from] = query._fromTable;
      if (op.expand) req[op.expand] = query._expands;
      req[op.select] = singles["onSelect"] ? callAdaptorFunc(this, "onSelect", getValue(singles["onSelect"].fieldNames, query), query) : "";
      req[op.count] = query._requiresCount ? callAdaptorFunc(this, "onCount", query._requiresCount, query) : "";
      req[op.search] = r.searches.length ? callAdaptorFunc(this, "onSearch", r.searches, query) : "";
      req[op.skip] = singles["onSkip"] ? callAdaptorFunc(this, "onSkip", getValue(singles["onSkip"].nos, query), query) : "";
      req[op.take] = singles["onTake"] ? callAdaptorFunc(this, "onTake", getValue(singles["onTake"].nos, query), query) : "";
      req[op.where] = r.filters.length || r.searches.length ? callAdaptorFunc(this, "onWhere", r.filters, query) : "";
      req[op.sortBy] = r.sorted.length ? callAdaptorFunc(this, "onSortBy", r.sorted, query) : "";
      req[op.group] = r.grouped.length ? callAdaptorFunc(this, "onGroup", r.grouped, query) : "";
      req[op.aggregates] = r.aggregates.length ? callAdaptorFunc(this, "onAggregates", r.aggregates, query) : "";
      req["param"] = [];

      // Params
      callAdaptorFunc(this, "addParams", { dm: dm, query: query, params: params, reqParams: req });

      // cleanup
      for (var prop in req) {
        if (isNull(req[prop]) || req[prop] === "" || req[prop].length === 0 || prop === "params")
          delete req[prop];
      }

      if (!(op.skip in req && op.take in req) && take !== null) {
        req[op.skip] = callAdaptorFunc(this, "onSkip", skip, query);
        req[op.take] = callAdaptorFunc(this, "onTake", take, query);
      }
      var p = this.pvt;
      this.pvt = {};

      if (this.options.requestType === "json") {
        return {
          data: JSON.stringify(req),
          url: url,
          ejPvtData: p,
          type: "POST",
          contentType: "application/json; charset=utf-8"
        }
      }
      tmp = this.convertToQueryString(req, query, dm);
      tmp =  (dm.dataSource.url.indexOf("?")!== -1 ? "&" : "/") + tmp;
      return {
        type: "GET",
        url: tmp.length ? url.replace(/\/*$/, tmp) : url,
        ejPvtData: p
      };
    },


    beforeSend: function (dm, request, settings) {

      // let strWhere = this.convertToQueryString(req, query, dm);

      // {%22where%22:{%22lastName%22:{%22like%22:%22Bedecs.*%22}}
      //{%22where%22:{%22lastName%22:{%22like%22:%22B.*%22}}}
      //  let json = JSON.stringify(strWhere)
    },


    convertToQueryString: function (req, query, dm) {
      if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1)
        return $.param(req);
      return "?" + $.param(req);
    },

    // convertToQueryString: function (req, query, dm) {
    //   //delete req.count
    //   // let json = JSON.stringify(req)
    //   return req
    // },

    processResponse: function (result, ds, query, xhr, request, changes) {

      let data = {result: result.rows, count: result.count};
      return data

    },

    test: function (dm, query, hierarchyFilters) {
      var sorted = filterQueries(query.queries, "onSortBy"),
        grouped = filterQueries(query.queries, "onGroup"),
        filters = filterQueries(query.queries, "onWhere"),
        searchs = filterQueries(query.queries, "onSearch"),
        aggregates = filterQueries(query.queries, "onAggregates"),
        singles = filterQueryLists(query.queries, ["onSelect", "onPage", "onSkip", "onTake", "onRange"]),
        params = query._params,
        url = dm.dataSource.url, tmp, skip, take = null,
        op = this.options;

      var r = {
        sorted: [],
        grouped: [],
        filters: [],
        searches: [],
        aggregates: []
      };

      // calc Paging & Range
      if (singles["onPage"]) {
        tmp = singles["onPage"];
        skip = getValue(tmp.pageIndex, query);
        take = getValue(tmp.pageSize, query);
        skip = (skip - 1) * take;
      } else if (singles["onRange"]) {
        tmp = singles["onRange"];
        skip = tmp.start;
        take = tmp.end - tmp.start;
      }

      // Sorting
      for (var i = 0; i < sorted.length; i++) {
        tmp = getValue(sorted[i].e.fieldName, query);

        r.sorted.push(callAdaptorFunc(this, "onEachSort", {name: tmp, direction: sorted[i].e.direction}, query));
      }

      // hierarchy
      if (hierarchyFilters) {
        tmp = this.getFiltersFrom(hierarchyFilters, query);
        if (tmp)
          r.filters.push(callAdaptorFunc(this, "onEachWhere", tmp.toJSON(), query));
      }

      // Filters
      for (var i = 0; i < filters.length; i++) {
        r.filters.push(callAdaptorFunc(this, "onEachWhere", filters[i].e.toJSON(), query));

        for (var prop in r.filters[i]) {
          if (isNull(r[prop]))
            delete r[prop];
        }
      }

      // Searches
      for (var i = 0; i < searchs.length; i++) {
        tmp = searchs[i].e;
        r.searches.push(callAdaptorFunc(this, "onEachSearch", {
          fields: tmp.fieldNames,
          operator: tmp.operator,
          key: tmp.searchKey,
          ignoreCase: tmp.ignoreCase
        }, query));
      }

      // Grouping
      for (var i = 0; i < grouped.length; i++) {
        r.grouped.push(getValue(grouped[i].e.fieldName, query));
      }

      // aggregates
      for (var i = 0; i < aggregates.length; i++) {
        tmp = aggregates[i].e;
        r.aggregates.push({type: tmp.type, field: getValue(tmp.field, query)});
      }

      var req = {};
      req[op.from] = query._fromTable;
      if (op.expand) req[op.expand] = query._expands;
      req[op.select] = singles["onSelect"] ? callAdaptorFunc(this, "onSelect", getValue(singles["onSelect"].fieldNames, query), query) : "";
      req[op.count] = query._requiresCount ? callAdaptorFunc(this, "onCount", query._requiresCount, query) : "";
      req[op.search] = r.searches.length ? callAdaptorFunc(this, "onSearch", r.searches, query) : "";
      req[op.skip] = singles["onSkip"] ? callAdaptorFunc(this, "onSkip", getValue(singles["onSkip"].nos, query), query) : "";
      req[op.take] = singles["onTake"] ? callAdaptorFunc(this, "onTake", getValue(singles["onTake"].nos, query), query) : "";
      req[op.where] = r.filters.length || r.searches.length ? callAdaptorFunc(this, "onWhere", r.filters, query) : "";
      req[op.sortBy] = r.sorted.length ? callAdaptorFunc(this, "onSortBy", r.sorted, query) : "";
      req[op.group] = r.grouped.length ? callAdaptorFunc(this, "onGroup", r.grouped, query) : "";
      req[op.aggregates] = r.aggregates.length ? callAdaptorFunc(this, "onAggregates", r.aggregates, query) : "";
      req["param"] = [];

      // Params
      callAdaptorFunc(this, "addParams", {dm: dm, query: query, params: params, reqParams: req});

      // cleanup
      for (var prop in req) {
        if (isNull(req[prop]) || req[prop] === "" || req[prop].length === 0 || prop === "params")
          delete req[prop];
      }

      if (!(op.skip in req && op.take in req) && take !== null) {
        req[op.skip] = callAdaptorFunc(this, "onSkip", skip, query);
        req[op.take] = callAdaptorFunc(this, "onTake", take, query);
      }
      var p = this.pvt;
      this.pvt = {};


      let strWhere = this.convertToQueryString(req, query, dm);

      // {%22where%22:{%22lastName%22:{%22like%22:%22Bedecs.*%22}}
      //{%22where%22:{%22lastName%22:{%22like%22:%22B.*%22}}}
      let json = JSON.stringify(strWhere)
      return {
        type: "GET",
        data: strWhere,
        url: url,
        ejPvtData: p
      };
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


// settings.type = "GET";
// let dataObj = JSON.parse(settings.data);
// delete dataObj.count;
// delete dataObj.limit;
// delete dataObj.skip;
// let objWhere = {where: {lastName: 'Bedecs'}};
// let jsonStr = JSON.stringify(objWhere);
// let params = '?' + 'filter=' + (jsonStr);
//
// settings.url = settings.url + params



// convertToQueryString: function (req, query, dm) {
//
//   let guid, paramFieldName, params, operator, paramVal,
//     paramOperator, count, limit, skip, ignoreCase, isComplex
//
//   let data = {};
//   let objWhere = {};
//   count = req.count;
//   skip = req.skip;
//   limit = req.limit;
//
//   params = query.queries[0];
//   ignoreCase = params.ignoreCase;
//   isComplex = params.isComplex;
//
//   paramFieldName = params.e.field;
//
//
//   if (paramVal instanceof Date) {
//     console.log('date');
//     val = "datetime'" + p.replacer(val).toJSON() + "'";
//   } else if (guid) {
//     console.log('guid');
//   } else {
//     console.log('string');
//
//
//     if (paramFieldName) {
//       paramOperator = params.e.operator;
//       paramVal = params.e.value;
//       guid = ej.isGUID(paramVal);
//
//       operator = this.loopBackOperators[paramOperator];
//
//
//       if (operator) {
//
//         if (operator == '=') {
//           data = {[paramFieldName]: paramVal};
//         }
//         else if (operator == 'startswith' || operator == 'endswith') {
//           // {"where": {"lastName": {"like": "B.*"}}};
//           data[paramFieldName] = {'like': paramVal + '.*'};
//         } else {
//           //date: {gt: new Date('2014-04-01T18:30:00.000Z')}
//          let myarry=[];
//           myarry.push(paramVal)
//           data[paramFieldName] = {gt :myarry };
//         }
//       }
//       objWhere.where = data
//     } else {
//       objWhere = req
//     }
//   //  id: {gt: 5)}
//     delete objWhere.count;
//     delete objWhere.skip;
//     delete objWhere.limit;
//
//     //works  {"id": {"between": [0,7]}}
//    //works {"id": {"gt": [7]}}
//  //-   let jsonStr = JSON.stringify({where: {id: {between: [0,7]}}});
//     let jsonStr = JSON.stringify(objWhere)
//     let queryStr = 'filter=' + jsonStr;
//
//     return queryStr;
//   }
// },
