const { genFullShortId } = require('./fsg-shared/util/idgen');

for(var i=0; i<5; i++) {
    console.log(genFullShortId(5));
}