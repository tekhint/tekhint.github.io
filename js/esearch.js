 function blogsearch() {

 // var search = elasticlunr(function () {
 //    this.addField('title');
 //    this.addField('content');
 //    this.setRef('uri');
 //  });


 // $(".faq-question").each(function (index, element) {
 //    var $q = $(element);
 //    var question = $q.find(".faq-headline").text();
 //    var answer = $q.find(".faq-answer").text();
 //    var $qid = $q.find(".qid").val();

 //    /* init ElasticLunar */
 //    var docid = {
 //      uri: $q.attr('uri'),
 //      title: question,
 //      content: answer
 //    };
 //    search.addDoc(docid);
 //  });

function initLunr() {
    if (!endsWith(baseurl,"/")){
        baseurl = baseurl+'/'
    };

  // First retrieve the index file
    $.getJSON(baseurl +"index.json")
        .done(function(index) {
            pagesIndex =   index;
            // Set up lunrjs by declaring the fields we use
            // Also provide their boost level for the ranking
            lunrIndex = new elasticlunr.Index
            lunrIndex.ref("uri");
            lunrIndex.field('title', {
                boost: 15
            });
            lunrIndex.field('tags', {
                boost: 10
            });
            lunrIndex.field("content", {
                boost: 5
            });

            // Feed lunr with each file and let lunr actually index them
            pagesIndex.forEach(function(page) {
            	console.log(page);
                lunrIndex.add(page);
            });
            lunrIndex.pipeline.remove(lunrIndex.stemmer)
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.error("Error getting Hugo index flie:", err);
        });

$( "#search-faq" ).keyup(function() {
  var searchCtrl = $( "#search-by" ).val();
  var searchResult = search.search(searchCtrl) || [];
  $('#search-results').empty(); /* celar old results */
  for (var i = 0; i < searchResult.length; i++) {
    var qId = searchResult[i]['ref'];
    var q = $('#' + qId + ' .question-content').text();
    $('#search-results').append("" + q + " ");
    /* open the suggestion list */
    $('#search-results').addClass('is-active'); 
  };
    $('#search-results').slideDown();
    });
}


  $('#search-results').on('click', '.search-result', function() {
    $('.faq-question').removeClass('is-active');
    $('#search-results').slideUp();
    $('.faq-question', $(this).attr("href")).addClass('is-active');
  });

}