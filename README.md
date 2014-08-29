#simple-filters

Simple filters is a simple plugin for adding filters to HTML tables.

##Demo

See a demo at JSFiddle: 
http://jsfiddle.net/y9Ldhvgm/

##Example Code

```javascript
var table = $('table').simpleFilters({  
   "footer":"on",
   "filterSelects":false,
   "external":[  
      {  
         "column":"0",
         "placeholder":"#filter-holder-0",
         "type":"text"
      },
      {  
         "column":"1",
         "placeholder":"#filter-holder-1",
         "type":"numeric"
      },
      {  
         "column":"2",
         "placeholder":"#filter-holder-2",
         "type":"date"
      }
   ]
});
```
