var sub_condition = 2;
var edu_condition = 1;
var job_condition = 1;
var awd_condition = 1;
var rhs_condition = 1;
var hss_condition = 0;
var fmp_condition = 0;
// var rsg_condition = 0;
// var epa_condition = 0;
// var e_c_condition = 1;
// var w_c_condition = 0;
// var m_c_condition = 0;

var datatable = null;
var db = openDatabase("LocalData", "", "My Database", 1024 * 100);

function init() {
	datatable = document.getElementById("datatable");
	db.transaction(function(tx) {
		tx.executeSql("drop table PlanInfo", []);
		//tx.executeSql("INSERT INTO PlanInfo VALUES (1, '长江', 45, 55, 4, 4, 1, 1, 0, 0, 0, 20, 0, 0, 200.000000)",[]);
	});
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE PlanInfo (id [INTEGER KEY] NOT NULL, name VARCHAR NOT NULL, age2  INTEGER, age1  INTEGER, edu INTEGER, job INTEGER, awd   INTEGER, rhs   INTEGER, area  INTEGER, rsg2  INTEGER, rsg1  INTEGER, epa   INTEGER, hss   INTEGER,  fmp   INTEGER, score REAL)", []);
	});
	AddInfo();
	//	    showAllData();
}

//删除html中table下的所有的子节点
function removeAllData() {
	for(var i = datatable.childNodes.length - 1; i >= 0; i--) {
		datatable.removeChild(datatable.childNodes[i]);
	}
	var tr = document.createElement("tr");
	var th = document.createElement("th");

	th.innerHTML = "学者计划";

	tr.appendChild(th);

	datatable.appendChild(tr);
}

//显示数据信息内容
function showData(row) {
	var tr = document.createElement("tr");
	var td = document.createElement("td");

	td.innerHTML = row.name;

	tr.appendChild(td);

	datatable.appendChild(tr);
}

function select_fmp_change(val) {
	fmp_condition = val;
	console.log(val);
}

function select_sub_change(val) {
	sub_condition = val;
	console.log(val);
}

function select_edu_change(val) {
	edu_condition = val;
	console.log(val);
}

function select_job_change(val) {
	job_condition = val;
	console.log(val);
}

function select_awd_change(val) {
	awd_condition = val;
	console.log(val);
}

function select_rhs_change(val) {
	rhs_condition = val;
	console.log(val);
}

function select_hss_change(val) {
	hss_condition = val;
	console.log(val);
}

function sqlsearch() {
	var query = "select name from PlanInfo where hss >= " + hss_condition + " and fmp >= " + fmp_condition; //,[hss_condition,fmp_condition];
	var age_condition = document.getElementById("age").value;
	var rsg_condition = document.getElementById("rsg").value;
	var epa_condition = document.getElementById("epa").value;
	if(age_condition == "" && rsg_condition == "") {
		// 没有输入年龄和科研补贴
	} else // 输入了年龄或科研补贴
	{
		if(sub_condition == 1) // 人文
		{
			if(age_condition != "")
				query += " and age1 >= " + age_condition; //,[age_condition];
			if(rsg_condition != "")
				query += " and rsg1 >= " + rsg_condition; //,[rsg_condition];
		} else // 理工
		{
			if(age_condition != "")
				query += " and age2 >= " + age_condition; //,[age_condition];
			if(rsg_condition != "")
				query += " and rsg2 >= " + rsg_condition; //,[age_condition];
		}
	}

	if(epa_condition != "") // 预期津贴
		query += " and epa >= " + epa_condition; //, [epa_condition];	
	query += " and edu <= " + edu_condition; //, [edu_condition];	// 学历
	query += " and job <= " + job_condition; //, [job_condition];	// 职称
	query += " and awd <= " + awd_condition; //, [awd_condition]; 	// 奖项
	query += " and rhs <= " + rhs_condition; //, [rhs_condition]; 	// 科研

	var groupCheckbox = $("input[name='check']");
	var e_c_condition = 0;
	var w_c_condition = 0;
	var m_c_condition = 0;
	if(groupCheckbox[0].checked)
		e_c_condition = 1;
	if(groupCheckbox[1].checked)
		w_c_condition = 1;
	if(groupCheckbox[2].checked)
		m_c_condition = 1;

	console.log(e_c_condition + w_c_condition + m_c_condition);
	if(e_c_condition + w_c_condition + m_c_condition == 1) {
		if(e_c_condition == 1) {
			query += " and (area = 0 or area = 3)";
		}
		if(w_c_condition == 1) {
			query += " and (area = 0 or area = 2)";
		}
		if(m_c_condition == 1) {
			query += " and (area = 0 or area = 1)";
		}
	} else if(e_c_condition + w_c_condition + m_c_condition == 2) {
		if(e_c_condition == 0) {
			query += " and area != 3";
		}
		if(w_c_condition == 0) {
			query += " and area != 2";
		}
		if(m_c_condition == 0) {
			query += " and area != 1";
		}
	}

	query += " order by score desc";
	console.log(query);

	db.transaction(function(tx) {
		tx.executeSql(query, [], function(tx, rs) {
			removeAllData();
			if(rs.rows.length == 0)
				alert("没有搜索结果！");
			for(var i = 0; i < rs.rows.length; i++) {
				showData(rs.rows.item(i));
			}
			//for(var i = 0; i < 5; i++) {
			//	showData(rs.rows.item(i));
			//}
		});
	})
}

function AddInfo() {
	db.transaction(function(tx) {
		//tx.executeSql("BEGIN TRANSACTION",[]);

		tx.executeSql("INSERT INTO PlanInfo VALUES (1,'长江学者',45,55,4,4,1,1,0,0,0,20,0,0,200.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (2,'两江学者',55,55,4,4,3,5,2,20,20,6,1,1,309.03)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (3,'龙江学者',45,45,4,4,1,1,1,50,20,20,0,0,195.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (4,'湘江学者',50,50,4,4,3,4,1,10,10,12,0,0,140.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (5,'潇湘学者',55,55,4,4,1,1,1,0,0,100,1,1,325.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (6,'皖江学者',45,45,4,3,1,1,3,40,20,20,0,0,193.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (7,'浦江学者',50,50,3,1,1,1,3,0,0,0,0,0,133.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (8,'黄河学者',50,55,4,4,1,4,1,60,20,15,1,1,275.14)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (9,'海河学者',45,45,4,4,1,1,3,0,0,10,0,0,100.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (10,'珠江学者',45,45,4,4,1,1,3,200,50,12,0,0,211.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (11,'漓江学者',60,60,1,1,1,3,3,300,30,15,1,1,277.22)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (12,'闽江学者',45,50,4,4,1,1,3,200,50,12,0,0,211.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (13,'钱江学者',50,50,4,1,1,1,3,100,50,25,0,0,183.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (14,'瓯江学者',100,100,4,2,1,1,3,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (15,'甬江学者',45,50,4,4,1,4,3,60,20,20,0,0,130.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (16,'香江学者',35,35,4,1,1,1,3,0,0,54,0,0,183.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (17,'太湖学者',45,45,4,4,1,1,3,0,0,6,1,1,201.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (18,'曲江学者',45,50,4,4,1,1,2,80,80,20,1,1,301.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (19,'西湖学者',45,50,4,4,1,1,3,0,0,50,0,0,150.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (20,'鉴湖学者',55,55,4,4,2,4,3,7,5,15,1,1,271.44)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (21,'磁湖学者',100,100,1,1,3,4,1,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (22,'瑶湖学者',65,65,1,1,1,1,1,0,0,20,1,0,141.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (23,'北洋学者',100,100,1,1,1,1,3,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (24,'天山学者',100,100,1,1,1,1,2,0,0,40,0,0,183.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (25,'昆仑学者',45,45,4,4,1,1,2,80,20,10,0,0,133.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (26,'阴山学者',100,100,1,1,3,4,1,3,2,0,0,0,117.50)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (27,'贺兰山学者',50,55,4,1,1,1,2,200,200,0,0,0,150.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (28,'秦岭学者',45,50,4,4,3,4,2,25,15,0,1,1,217.78)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (29,'云岭学者',55,55,4,4,3,5,2,200,200,5,0,0,191.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (30,'南岭学者',55,55,1,4,1,1,3,50,50,0,1,0,216.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (31,'泰山学者',55,55,4,4,3,5,3,35,35,35,0,0,220.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (32,'华山学者',35,35,4,2,1,1,1,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (33,'嵩山学者',50,50,4,4,3,4,1,0,0,10,1,0,122.22)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (34,'黄山学者',40,40,4,4,3,4,3,200,30,3,1,1,296.11)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (35,'神农学者',50,50,4,1,3,1,1,1000,200,80,1,1,439.58)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (36,'香涛学者',45,45,4,4,3,4,1,20,20,10,1,1,267.22)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (37,'文澜学者',60,60,1,1,2,4,1,0,0,3.34,0,0,72.23)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (38,'天佑学者',100,100,1,4,1,4,1,0,0,15,0,0,141.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (39,'越崎学者',100,100,1,1,1,1,3,500,500,80,0,0,333.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (40,'鹏城学者',50,50,1,4,1,1,3,100,50,30,0,0,158.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (41,'东方学者',40,40,4,3,1,1,3,60,60,10,0,0,136.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (42,'齐鲁学者',35,35,4,2,1,1,3,100,30,15,1,0,163.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (43,'八桂学者',35,40,4,2,1,1,3,500,100,20,1,0,261.11)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (44,'三晋学者',55,55,1,1,3,4,1,0,0,40,0,0,183.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (45,'楚天学者',55,55,4,4,1,1,1,0,0,30,0,0,200.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (46,'鸢都学者',100,100,4,2,3,2,3,2,2,4,0,0,140.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (47,'沪江学者',45,50,4,4,2,4,3,0,0,30,1,0,186.11)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (48,'长安学者',45,45,1,1,3,4,2,0,0,30,0,0,166.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (49,'星海学者',45,50,4,4,1,1,3,0,0,25,0,0,158.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (50,'金普学者',100,100,1,1,1,1,3,0,0,80,0,0,216.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (51,'首山学者',45,45,4,1,1,1,3,500,500,12,1,1,428.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (52,'岳麓山学者',100,100,1,1,3,5,1,0,0,20,0,0,150.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (53,'天柱山学者',42,42,4,2,2,4,3,0,0,30,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (54,'桂子山学者',100,100,1,1,1,1,1,0,0,0,1,0,137.50)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (55,'珞珈学者',45,50,1,4,1,1,1,100,25,10,0,0,104.17)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (56,'旗山学者',35,35,4,2,1,5,3,25,10,10,0,0,89.17)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (57,'钟山学者',35,35,4,1,1,1,3,0,0,3,1,0,92.50)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (58,'金山学者',45,45,4,4,3,5,3,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (59,'珠峰学者',45,45,1,4,1,1,2,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (60,'芙蓉学者',45,45,4,1,1,1,1,0,0,10,0,0,100.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (61,'桐江学者',55,55,4,4,1,1,3,50,20,10,1,1,271.39)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (62,'胡杨学者',100,100,4,4,1,1,2,100,100,0,0,0,150.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (63,'杏林学者',65,65,1,1,3,5,2,30,30,0,0,0,126.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (64,'荔园学者',60,60,1,1,3,4,3,15,15,0,0,0,88.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (65,'白杨学者',100,100,1,1,1,1,3,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (66,'萃英学者',55,55,4,3,1,1,2,100,15,0,1,0,116.39)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (67,'长城学者',42,50,4,4,1,1,3,0,0,0,0,0,100.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (68,'飞天学者',46,51,4,1,1,1,2,7.5,7.5,0,0,0,69.17)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (69,'绿洲学者',45,45,4,4,1,1,2,40,40,0,1,0,138.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (70,'雁塔学者',100,100,4,1,1,1,2,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (71,'北京学者',55,55,1,4,1,1,3,200,20,0,0,0,170.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (72,'中原学者',57,57,1,4,1,1,1,0,0,0,0,0,150.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (73,'攀登学者',50,50,4,3,1,4,3,0,0,0,0,0,100.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (74,'卓越学者',55,55,4,4,2,4,3,20,10,0,0,0,105.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (75,'翱翔学者',40,45,1,1,1,1,2,0,0,8,1,1,234.17)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (76,'仲英青年',38,38,4,1,1,1,0,10,6.7,12,0,0,89.45)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (77,'晨辉学者',30,30,4,1,1,1,3,0,0,10,0,0,133.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (78,'辽河学者',42,50,4,4,1,1,3,23.3,13.3,3.3,0,0,78.27)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (79,'梅岭学者',45,45,4,4,1,1,1,0,0,0,0,1,166.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (80,'紫金学者',55,55,4,1,1,1,3,0,0,8,0,0,130.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (81,'长空学者',40,45,1,1,1,1,3,0,0,10,0,0,133.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (82,'求是特聘',55,55,4,4,1,1,3,300,50,0,1,0,195.83)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (83,'树人学者',50,50,4,4,1,1,1,800,400,50,1,0,316.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (84,'兴华学者',100,100,1,4,1,1,3,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (85,'腾飞学者',50,50,1,1,1,1,3,0,0,50,0,0,200.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (86,'阳光学者',65,65,4,4,3,2,1,0,0,18,0,0,96.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (87,'元光学者',55,55,1,1,1,1,3,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (88,'湛蓝学者',45,45,3,3,2,3,3,0,0,0,0,0,116.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (89,'东陆学者',100,100,1,1,1,1,2,0,0,10,0,0,100.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (90,'雏鹰学者',37,49,1,1,1,1,2,0,0,10,0,0,83.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (91,'东吴学者',40,50,4,1,1,4,3,50,50,0,0,0,133.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (92,'地大学者',50,50,1,4,3,4,3,200,50,40,1,0,241.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (93,'工大学者',45,45,4,1,1,1,1,50,25,8,1,1,242.50)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (94,'海洋学者',42,45,4,3,1,1,3,0,0,0,0,0,66.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (95,'华中学者',100,100,1,1,1,1,1,0,0,10,0,0,133.33)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (96,'天工学者',45,45,4,3,1,1,3,0,0,30,1,0,177.78)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (97,'西华学者',55,55,4,1,1,1,2,0,0,2.4,0,0,120.67)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (98,'西外学者',100,100,4,4,1,1,2,0,0,60,0,0,150.00)", []);
		tx.executeSql("INSERT INTO PlanInfo VALUES (99,'井冈学者',50,50,4,3,1,4,1,0,0,20,1,0,225.00)", []);
		//tx.executeSql("COMMIT",[]);
	});
}
