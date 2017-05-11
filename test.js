
var Redis = require('ioredis')
var mysql = require('mysql')
var chai = require('chai')
var should = chai.should()

describe('dockerize mocha tests that depend on services', function () {
    var redisClient;
    var SQLClient;
    it('should connect to redis', function () {
        redisClient = new Redis(6379, 'redis', { lazyConnect: true })
        return redisClient.connect()
    })

    it('should connect to mysql', function (done) {
        SQLClient = mysql.createConnection({
            host: 'mysql',
            user: 'root'
        });
        SQLClient.connect(done);
    })
    it("should set key value", function () {
        redisClient.set("foo", "bar");
        redisClient.get("foo").then(function (result) {
            result.should.be.string;
        })
    })
    it("should do 1+1 in mysql", function () {
        SQLClient.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;
            results[0].solution.should.be.equal(2);
        });
    })
    after(function() {
        SQLClient.end();
    });
})
