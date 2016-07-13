function thrinkDelay(t) {
  if (t <= 12000) {
    return t;
  } else {
    t = t / 10;
    return thrinkDelay(t);
  }
}

loadJSON('/temp.json', function(response) {
  var svg = d3.select('svg');
  var stepsDom = document.getElementById('steps');

  // Parse JSON string into object
  var datas = JSON.parse(response);
  var pages = new Array;

  var i = 0;
  var delay = 1000;

  function onEvent() {
    setTimeout(function() {
      var _timestamp = datas[i].time;
      var _page = datas[i].page;
      var _event = datas[i].event;

      console.log('<' + _page + '>');
      svg.selectAll("rect").attr("class", "unselected");
      if (pages.indexOf(_page) < 0) {
        pages.push(_page);
      }

      var _pageIdx = pages.indexOf(_page);
      var g = svg.append('g')
      g.attr("id", "g_" + _page);
      g.append("rect")
      .attr("id", _page)
      .attr("x", 20 * (_pageIdx + 1) + _pageIdx * 100)
      .attr("y", 20)
      .attr("width", 100)
      .attr("height", 100)
      .attr("class", "selected");
      if (_pageIdx == pages.length - 1) {
        g.append("text")
        .attr("x", 20 * (_pageIdx + 1) + _pageIdx * 100 + 2)
        .attr("y", 16)
        .attr("id", "p" + _page)
        // .attr("font-size", 12)
        .attr("fill", "blue")
        .text(_page);
      }
      svg.select("rect#" + _page).attr("class", "selected");

      if (datas[i+1]) {
        var _nextTimestamp = datas[i+1].time;
        delay = _nextTimestamp - _timestamp;
        $('#steps').append('<li id="p' + i + '">进入&lt;' + _page + '&gt;页面, 停留' + delay / 1000 + '秒' + '</li>');
        svg.select("#g_" + _page).append("text")
          .text("停留" + delay / 1000 + '秒')
          .attr("x", 20 * (_pageIdx + 1) + _pageIdx * 100)
          .attr("y", 130)
          .attr("fill", "blue")
          .transition()
          .duration(2500)
          .style("opacity", 0)
          .remove();
        delay = thrinkDelay(delay);
        console.log('>> >> ' + delay);

        i++;
        onEvent();
      } else {
        alert('重放完毕');
      }
    }, delay);
  }

  onEvent();
});
