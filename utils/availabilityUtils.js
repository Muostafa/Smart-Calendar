export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function toStr(obj) {
  var res = `{"availability": [`;

  var temp = Object.entries(obj);
  temp.map((e) => {
    res += `{"dayOfWeek": "${e[1].dayOfWeek}","timeSlots": [`;
    Object.entries(e[1].timeSlots).map(
      (e) =>
        (res += `
        {
            "from": "${e[1].from}",
            "to": "${e[1].to}"
        },`)
    );
    res = res.slice(0, -1);
    res += "]},";
  });

  res = res.slice(0, -1);
  res += "]}";

  return res;
}

export function convertToTime(number) {
  var hours = Math.floor(number / 100);
  var minutes = number % 100;
  var formattedHours = ("0" + hours).slice(-2);
  var formattedMinutes = ("0" + minutes).slice(-2);
  return formattedHours + ":" + formattedMinutes;
}

export function merge(intervals) {
  let ans = [];
  intervals.sort((a, b) => a[0] - b[0]);

  if (intervals.length === 0) {
    return ans;
  }

  let temp = intervals[0];
  for (let i = 0; i < intervals.length; i++) {
    if (intervals[i][0] <= temp[1]) {
      temp[1] = Math.max(temp[1], intervals[i][1]);
    } else {
      ans.push(temp);
      temp = intervals[i];
    }
  }
  ans.push(temp);

  return ans;
}

export function handleOverlapping(arr) {
  var intervals = [];
  for (var i = 0; i < arr.length; i++) {
    var start = Number(arr[i].from.replace(":", ""));
    var end = Number(arr[i].to.replace(":", ""));
    intervals.push([start, end]);
  }

  var overlapped = merge(intervals);

  var res = [];

  for (var i = 0; i < overlapped.length; i++) {
    var from = convertToTime(overlapped[i][0]);
    var to = convertToTime(overlapped[i][1]);

    res.push({ from: from, to: to });
  }
  return res;
}

export function combineTimeslots(obj1, obj2) {
  for (var i = 0; i < obj1.length; i++) {
    var dayOfWeek = obj1[i].dayOfWeek;
    for (var j = 0; j < obj2.length; j++) {
      if (obj2[j].dayOfWeek === dayOfWeek) {
        obj1[i].timeSlots = obj1[i].timeSlots.concat(obj2[j].timeSlots);
      }
    }
  }
  for (var j = 0; j < obj2.length; j++) {
    var bool = false;
    for (var i = 0; i < obj1.length; i++) {
      bool = bool || obj2[j].dayOfWeek == obj1[i].dayOfWeek;
    }
    if (!bool) {
      obj1.push(obj2[j]);
    }
  }

  for (var i = 0; i < obj1.length; i++) {
    obj1[i].timeSlots = handleOverlapping(obj1[i].timeSlots);
  }

  return obj1;
}
