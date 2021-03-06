package indi.kennhuang.rfidwatchdog.server.module;

import indi.kennhuang.rfidwatchdog.server.db.SQLite;


import java.sql.ResultSet;
import java.sql.SQLException;

public class Door {
    public int id;
    public String name;
    public String auth_token;

    public Door(){
        id = 0;
        name = "";
        auth_token = "";
    }

    public static Door findDoorById(int id) throws SQLException {
        ResultSet query = SQLite.getStatement().executeQuery("SELECT * FROM doors where id is " + id);
        if(query.isClosed()){
            return null;
        }
        return putResult(query);
    }

//    public static Door find

    private static Door putResult(ResultSet query) throws SQLException {
        Door res = new Door();
        res.id = query.getInt("id");
        res.name = query.getString("name");
        res.auth_token = query.getString("auth_token");
        return res;
    }
}
