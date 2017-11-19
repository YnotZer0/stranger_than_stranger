var records = [
    { id: 1, username: 'mb1', password: 'str4ng3r', type: 'pollywog_', displayName: 'Millie', emails: [ { value: 'millisande.bath@ibm.com' } ] }
  , { id: 2, username: 'tp1', password: 'm4g1c14n', type: 'demon_', displayName: 'Just visiting from another dimension', emails: [ { value: 'IamAWizard@thatLivesOnTheMoonWithTheOtherInHumans.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
