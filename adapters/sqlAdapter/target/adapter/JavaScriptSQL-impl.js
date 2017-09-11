/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

//var getAccountsTransactionsStatement = "SELECT * FROM sb.usr_info";
var getAccountsTransactionsStatement = "select LM.LKP_NAME,LKP_VALUE_ID,LKP_CODE,LKP_DESC from SB.LKP_MST as LM, SB.LKP_VALUES as LV where LM.LKP_MST_ID = LV.LKP_MST_ID and LM.LKP_MST_ID in(1,3,4,5) ORDER BY LKP_CODE"

//Invoke prepared SQL query and return invocation result
function getAccountTransactions1(statement){
    var sqlStatement = statement || getAccountsTransactionsStatement;
	return MFP.Server.invokeSQLStatement({
		preparedStatement : sqlStatement,
		parameters : []
	});
}


//Invoke stored SQL procedure and return invocation result
function getAccountTransactions2(statement){
	return MFP.Server.invokeSQLStoredProcedure({
		procedure : "getAccountTransactions",
		parameters : [statement]
	});
}

