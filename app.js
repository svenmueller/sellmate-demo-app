/**
 * Module dependencies.
 */
var express     = require('express'),
    stylus      = require('stylus'),
    nib         = require('nib'),
    routes      = require('./routes'),
    Product     = require('./product'),
    Collection  = require('./collection'),
    Config      = require('./config');

/**
 * Create the server
 */
var app = module.exports = express.createServer();

/**
 * Server configuration
 */
app.error(function(err, req, res, next) {
    if (err instanceof NotFound) {
        res.render('404', { locals: {
            header: '#Header#'
            ,footer: '#Footer#'
            ,title : '404 - Not Found'
            ,description: ''
            ,author: ''
            ,analyticssiteid: 'XXXXXXX'
        },status: 404, layout: false});
    } else {
        res.render('500', { locals: {
            header: '#Header#'
            ,footer: '#Footer#'
            ,title : 'The Server Encountered an Error'
            ,description: ''
            ,author: ''
            ,analyticssiteid: 'XXXXXXX'
            ,error: err
        }, status: 500 , layout: false});
    }
});

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false }); // this will activate template inheritance in Express 2.x for Jade
    app.use(express.logger('dev'))
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(stylus.middleware({ 
        src: __dirname + '/public',
        compile: compile 
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: "skjghskdjfhbqigohqdiouk"
    }));
});

app.configure('development', function(){
    console.log("using config for 'development'");
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    console.log("using config for 'production'");
    app.use(express.errorHandler());
});


function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}


/**
 * Define app routes
 */
app.get('/', routes.index);
app.get('/callback', routes.callback);
app.get('/products/page/:page([0-9]+)', routes.products);
app.get('/products/:productId', routes.productId);
app.get('/products', function(req, res) {
    res.redirect('/products/page/1');
});
// This will create a product and redirect to the his page
app.post('/products', Product.create, function(req, res) {
    console.log("Create product");
    res.redirect('/products/' + req.product.id);
});
app.get('/collections', routes.collections);
app.get('/collections/:collectionId', routes.collectionId);
// A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});
//The 404 Route (ALWAYS Keep this as the last route)
app.get('/*', function(req, res){
    throw new NotFound;
});


/**
 * Define preconditions
 */
app.param('products', function(req, res, next, id) {
    // TODO: make sure that there is an access Token, otherwise request a new one
});
// Fetch a product
app.param('productId', function(req, res, next, id) {
    Product.load(id, function(err, product) {
        if (err) {
            return next(err);
        }
        if (!product) {
            return next(new Error('failed to find product'));
        }
        req.product = product;
        next();
    });
});
// Fetch a collection
app.param('collectionId', function(req, res, next, id) {
    Collection.load(id, function(err, collection) {
        if (err) {
            return next(err);
        }
        if (!collection) {
            return next(new Error('failed to find collection'));
        }
        req.collection = collection;
        next();
    });
});
// Fetch products by a collection
app.param('collectionId', function(req, res, next, id) {
    Product.listByCollection(id, function(err, products) {
        if (err) {
            return next(err);
        }
        if (!products) {
            return next(new Error('failed to find collection products'));
        }
        req.products = products;
        next();
    });
});
// Count the products
app.param('page', function(req, res, next, page) {
    Product.count(function(err, count) {
        if (err) {
            return next(err);
        }
        if (!count) {
            return next(new Error('failed to count products'));
        }
        req.count = count;
        next();
    });
});
// Fetch the products
app.param('page', function(req, res, next, page) {
    var limit = Config.pageLimit;
    Product.list(page, limit, function(err, products) {
        if (err) {
            return next(err);
        }
        if (!products) {
            return next(new Error('failed to find products'));
        }
        req.products = products;
        next();
    });
});


/**
 *  App port listener
 */
app.listen(8888, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
