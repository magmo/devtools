const { deployContracts } = require('./deployContracts');
const fs = require('fs-extra');

module.exports = {
  preDeployContracts: function(buildContractsPath, appPreBuiltContractArtifactsPath) {
    process.env.TARGET_NETWORK = 'ropsten';
    deployContracts().then(() => {
      process.env.TARG_NETWORK = 'kovan';
      deployContracts().then(() => {
        process.env.TARGET_NETWORK = 'rinkeby';
        deployContracts().then(() => {
          fs.readdir(buildContractsPath + '/', function(err, artifacts) {
            for (var i = 0; i < artifacts.length; i++) {
              fs.readJson(buildContractsPath + '/' + artifacts[i])
                .then(artifact => {
                  const strippedArtifact = {
                    contractName: artifact.contractName,
                    abi: artifact.abi,
                    bytecode: artifact.bytecode,
                    networks: artifact.networks
                  };

                  let data = JSON.stringify(strippedArtifact, null, 2);

                  fs.writeFile(appPreBuiltContractArtifactsPath + '/' + artifact.contractName + '.json', data, err => {
                    if (err) {
                      throw err;
                    }
                  });

                  console.log('Saved ' + artifact.contractName);
                })
                .catch(err => {
                  console.error(err);
                });
            }
          });
        });
      });
    });
  }
};
