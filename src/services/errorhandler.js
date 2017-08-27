export class UndandledErrorHandler {
  static init() {
    window.addEventListener('unhandledrejection', e => {
      // Prevent error output on the console:
      event.preventDefault();
      let reason = e.detail.reason;
      let promise = e.detail.promise;
      let stack = event.detail.reason.stack;
      //let msg = JSON.parse(e.detail.reason.message)
      console.log(e.detail.reason.message)
    });
    // NOTE: event name is all lower case as per DOM convention
    window.addEventListener("rejectionhandled",  e => {
      // NOTE: e.preventDefault() must be manually called prevent the default
      // action which is currently unset (but might be set to something in the future)
      e.preventDefault();
      // NOTE: parameters are properties of the event detail property
      let reason = e.detail.reason;
      let promise = e.detail.promise;
      // See Promise.onUnhandledRejectionHandled for parameter documentation
    });

    window.onerror = function (msg, url, lineNo, columnNo, error) {
      let string = msg.toLowerCase();
      let substring = "script error";
      if (string.indexOf(substring) > -1) {
        alert('Script Error: See Browser Console for Detail');
      } else {
        let message = [
          'Message: ' + msg,
          'URL: ' + url,
          'Line: ' + lineNo,
          'Column: ' + columnNo,
          'Error object: ' + JSON.stringify(error)
        ].join(' - ');
        alert(message);
      }
      return false;
    };
  }
}
