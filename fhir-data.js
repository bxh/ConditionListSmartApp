angular.module('hybridProblemPanel', [])
    .controller('hybridProblemPanelCtrl', ['$scope', function($scope){
        $scope.conditions = [];
        $scope.name = "";

        $scope.getCodeText = (code) =>{
            let preferred = code.coding.find(c => c.system == "http://hl7.org/fhir/sid/icd-9-cm");
            if(preferred != null) return preferred.display;
            else return code.text;
        }

        $scope.getDateTime = isoTime => moment(isoTime).format(moment.HTML5_FMT.DATE);

        FHIR.oauth2.ready(function(smart){
            smart.patient.read().then(patient => {
                let names = patient.name.map(name =>
                    name.given.join(" ") + " " + name.family.join(" ")
                );
                $scope.$apply(() => $scope.name = names.join(" / "));
            });

            smart.patient.api.search({type: "Condition"}).then(results => {
                let entries = results.data.entry;
                $scope.$apply(() => 
                    $scope.conditions = entries
                        .map(entry => entry.resource));
            });
        });
    }]);