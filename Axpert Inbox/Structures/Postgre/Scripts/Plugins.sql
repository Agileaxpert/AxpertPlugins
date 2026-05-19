<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1867330000004, 'F', 0, NULL, 'admin', '2026-04-27', 'admin', '2026-04-17', NULL, 1, 1, NULL, NULL, NULL, 'ds_inboxsearch', NULL, 'SELECT *
FROM json_to_recordset(
    (fn_inbox_search(:username, :searchtext)->''data'')
) AS x(
    taskid TEXT,
    taskname TEXT,
    touser TEXT,
    msgtype TEXT,
    taskstatus TEXT,
    edatetime TIMESTAMP
)
--ax_pagination', 'username,searchtext', 'username~Character~,searchtext~Character~', 'ALL', NULL, 'Application', 0, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>


<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1423550000006, 'F', 0, NULL, 'admin', '2026-04-30', 'admin', '2025-12-25', NULL, 1, 1, NULL, NULL, NULL, 'ds_inboxhistory', NULL, 'SELECT
    t.taskid AS TaskID,
    t.modifiedon AS DateTime,
CASE t.status
        WHEN ''Pending''        THEN t.assignby
        WHEN ''Accepted''       THEN h.lastactionby
        WHEN ''Forwarded''      THEN t.forwardedby
        WHEN ''Returned''       THEN t.returnby
        WHEN ''Completed''      THEN t.completedby
        WHEN ''Dropped''        THEN t.droppedby
        WHEN ''Closed''         THEN t.closedby
        WHEN ''Informed Delay'' THEN t.rescheduledby
        ELSE h.lastactionby
    END AS "From",
 
    CASE t.status
        WHEN ''Pending''   THEN t.assignto
        WHEN ''Forwarded'' THEN t.forwardedto
        WHEN ''Returned''  THEN t.returnto
        ELSE h.lastactionto
    END AS to_user,
 
    t.taskname        AS TaskName,
    t.taskdescription AS TaskDescription,
 
    CASE t.status
        WHEN ''Pending''        THEN ''Create''
        WHEN ''Forwarded''      THEN ''Send''
        WHEN ''Returned''       THEN ''Return''
        WHEN ''Completed''      THEN ''Complete''
        WHEN ''Dropped''        THEN ''Drop''
        WHEN ''Closed''         THEN ''Close''
        WHEN ''Informed Delay'' THEN ''Delay''
        WHEN ''Status Updated'' THEN ''Status Updated''
        ELSE t.status
    END AS Action,
CASE t.status
    WHEN ''Forwarded''       THEN t.forwardedreason
    WHEN ''Dropped''         THEN t.dropreason
    WHEN ''Returned''        THEN t.reason
    WHEN ''Status Updated''  THEN t.statremarks
    WHEN ''Closed''          THEN t.remarks
    WHEN ''Completed''       THEN t.comments
    WHEN ''Informed Delay''  THEN t.rescheduledreason
    ELSE NULL
END AS Comments,c1.customername,p1.companyname,
    t.axpfile_lastaction     AS files,
    t.axpfilepath_lastaction AS filepath,
 
    /* 1=Send, 2=Return, 3=Complete, 4=Drop, 5=Close, 6=Status Update, 7=Inform Delay */
 (
        CASE 
            WHEN t.status = ''Closed'' THEN ''''
when t.status=''Dropped'' then ''''

            -- Pending
            WHEN t.status = ''Pending''
                 AND t.assignby = :uname
                 AND t.assignto = :uname
            THEN ''1345''

            WHEN t.status = ''Pending''
                 AND t.assignto = :uname
            THEN ''1237''

            WHEN t.status = ''Pending''
                 AND t.assignby = :uname
            THEN ''45''

            WHEN t.status = ''Forwarded''
                 AND (h.lastactionby = :uname and h.lastactionto = :uname)
            THEN ''123457''
              WHEN t.status = ''Forwarded''
                 AND h.lastactionby = :uname 
            THEN ''6''
               WHEN t.status = ''Forwarded''
                 AND (h.assignby = :uname and  h.lastactionto = :uname)
            THEN ''123457''

               WHEN t.status = ''Forwarded''
                 AND  h.lastactionto = :uname
            THEN ''1237''
            
            WHEN t.status = ''Forwarded''
                      AND (h.assignby = :uname and  h.lastactionto = :uname)
            THEN ''45''
            
               WHEN t.status = ''Forwarded''
                      AND h.assignby = :uname 
            THEN ''45''

            WHEN t.status = ''Returned''
                 AND t.assignby = :uname
            THEN ''145''

                WHEN t.status = ''Returned''
                 AND (t.assignby = :uname and h.lastactionto=:uname)
            THEN ''1245''
            
            WHEN t.status = ''Returned''and  h.lastactionto = :uname
            THEN ''12''


            WHEN t.status = ''Completed''
                 AND t.assignby = :uname
            THEN ''15''

            WHEN t.status = ''Completed''
                 AND (t.assignby = :uname and h.lastactionby = :uname)
            THEN ''15''
             WHEN t.status = ''Completed'' 
             AND (t.assignby <> :uname AND h.lastactionby = :uname) 
             then ''12''

when t.status=''Status Updated''
and (t.assignto=:uname or h.lastactionto=:uname)
then ''123''

       when t.status=''Status Updated''
and (t.assignby=:uname)
then ''45''
            WHEN t.status = ''Informed Delay''
                 AND t.assignby = :uname
            THEN ''45''
            
            WHEN t.status = ''Informed Delay''
     AND t.assignto = :uname
then ''123''

   WHEN t.status = ''Informed Delay''
                 AND (t.assignto = :uname OR h.lastactionto = :uname)
            THEN ''123''
            
            
            WHEN t.status IN (''Dropped'',''Returned'',''Informed Delay'',''Forwarded'',''Completed'')
         AND (t.assignby = :uname AND t.assignto = :uname) THEN
            ''1245''

            ELSE ''''
        END
        ||
        CASE
            WHEN (t.assignto = :uname OR h.lastactionto = :uname)
            THEN ''6''
            ELSE ''''
        END
    ) AS Buttons

FROM taskstatus t

JOIN taskf_hdr h 
    ON h.taskid = t.taskid 

LEFT JOIN cusdt1 c1 
    ON c1.cusdt1id = h.customer

LEFT JOIN partnerdetails p1 
    ON p1.partnerdetailsid = h.partner

WHERE t.taskid = :ptaskid

ORDER BY t.modifiedon DESC', 'uname,ptaskid', 'uname~Character~,ptaskid~Character~', 'ALL', NULL, 'Application', 5, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>

<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1423110000001, 'F', 0, NULL, 'admin', '2026-04-28', 'admin', '2025-12-25', NULL, 1, 1, NULL, NULL, NULL, 'ds_axpertinbox', NULL, 'SELECT *
FROM vw_axpertinbox v
WHERE
(
 
    v.touser = :uname
)

AND
(

    (
        TRIM(:filter) = ''ALL''
    )
    
    OR
    
    (
        TRIM(:filter) = ''Open Tasks''
        AND v.msgtype IN (''Task'',''Ticket'')
        AND v.taskstatus NOT IN (''Completed'',''Closed'',''Dropped'')
    )
   
    OR
    (
        COALESCE(TRIM(:filter), '''') = ''''
    )
)
AND
(
    COALESCE(TRIM(:searchtext), '''') = ''''
    
    OR
    
    LOWER(
        COALESCE(v.taskname,'''') || '' '' ||
        COALESCE(v.taskid,'''') || '' '' ||
        COALESCE(v.displaycontent,'''') || '' '' ||
        COALESCE(v.displaytitle,'''') || '' '' ||
        COALESCE(v.fromuser,'''') || '' '' ||
        COALESCE(v.processname,'''') || '' '' ||
        COALESCE(v.eventdatetime,'''') || '' '' ||
        COALESCE(v.taskstatus,'''') || '' '' ||
        COALESCE(v.msgtype,'''')
    ) LIKE LOWER(''%'' || TRIM(:searchtext) || ''%'')
)

ORDER BY v.edatetime DESC
--ax_pagination', 'uname,filter,searchtext', 'uname~Character~,filter~Character~,searchtext~Character~', 'ALL', NULL, 'Application', 5, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>


<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1459660000007, 'F', 0, NULL, 'admin', '2026-04-28', 'admin', '2026-01-23', NULL, 1, 1, NULL, NULL, NULL, 'ds_advancedfilter', NULL, 'SELECT *
FROM vw_axpertinbox
WHERE
(
  
    COALESCE(TRIM(:searchtext), '''') <> ''''
    OR

    (
        (
            ''Notifications'' <> ALL (string_to_array(replace(:filter,'' '',''''), '',''))
            AND rectype = ''PEG''

            AND (
                COALESCE(TRIM(:uname),'''') = ''''
                OR touser = :uname
            )

            AND processname IN (
                ''Material Request'',
                ''Work from home Request'',
                ''Travel Request'',
                ''LeaveRequest'',
                ''Travel/Reimbursement Request''
            )
            AND
            (
                (
                    ''Pending'' = ANY (string_to_array(replace(:filter,'' '',''''), '',''))
                    AND cstatus = ''Active''
                    AND taskstatus = ''Pending''
                )
                OR
                (
                    ''Approved'' = ANY (string_to_array(replace(:filter,'' '',''''), '',''))
                    AND cstatus = ''Completed''
                    AND taskstatus = ''Approved''
                )
                OR
                (
                    ''Rejected'' = ANY (string_to_array(replace(:filter,'' '',''''), '',''))
                    AND cstatus = ''Completed''
                    AND taskstatus = ''Rejected''
                )
                OR
                (
                    ''Returned'' = ANY (string_to_array(replace(:filter,'' '',''''), '',''))
                    AND cstatus = ''Completed''
                    AND taskstatus = ''Returned''
                )
            )
        )
        OR
        (
            ''Notifications'' = ANY (string_to_array(replace(:filter,'' '',''''), '',''))
            AND rectype = ''MSG''

            AND (
                COALESCE(TRIM(:uname),'''') = ''''
                OR touser = :uname
            )
        )
    )
)
AND
(
    COALESCE(TRIM(:searchtext), '''') = ''''
    OR
    LOWER(
        COALESCE(taskname,'''') || '' '' ||
        COALESCE(taskid,'''') || '' '' ||
        COALESCE(displaycontent,'''') || '' '' ||
        COALESCE(displaytitle,'''') || '' '' ||
        COALESCE(fromuser,'''') || '' '' ||
        COALESCE(processname,'''') || '' '' ||
        COALESCE(eventdatetime,'''') || '' '' ||
        COALESCE(taskstatus,'''') || '' '' ||
        COALESCE(msgtype,'''')
    ) LIKE LOWER(''%'' || TRIM(:searchtext) || ''%'')
)

ORDER BY edatetime DESC
--ax_pagination', 'searchtext,filter,uname', 'searchtext~Character~,filter~Character~,uname~Character~', 'ALL', NULL, 'Application', 5, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>


<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1973550000009, 'F', 0, NULL, 'admin', '2026-01-21', 'admin', '2025-11-17', NULL, 1, 1, NULL, NULL, NULL, 'DS_TeamMember', NULL, 'SELECT username
FROM axusers
WHERE username=:username
UNION ALL
SELECT username
FROM axusers
WHERE reportingto=:username
order by 1', 'username', 'username~Character~', 'ALL', NULL, 'Application', 5, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>

<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1779990000005, 'F', 0, NULL, 'admin', '2026-04-28', 'admin', '2026-04-01', NULL, 1, 1, NULL, NULL, NULL, 'ds_teamall', NULL, 'SELECT *
FROM vw_axpertinbox v
WHERE 
(
    (
        :filter = ''TeamAll''
        AND v.touser IN 
        (
            SELECT u.username
            FROM axusers u
            WHERE u.reportingto = :uname
        )
    )
    OR
    (
        :filter <> ''Team All''
        AND v.touser = :filter
    )
)
AND 
(
    v.msgtype IN (''Task'',''Ticket'')   
    OR v.rectype = ''PEG''           
)

AND
(
    COALESCE(TRIM(:searchtext), '''') = ''''
    
    OR
    
    LOWER(
        COALESCE(v.taskname,'''') || '' '' ||
        COALESCE(v.taskid,'''') || '' '' ||
        COALESCE(v.displaycontent,'''') || '' '' ||
        COALESCE(v.displaytitle,'''') || '' '' ||
        COALESCE(v.fromuser,'''') || '' '' ||
        COALESCE(v.processname,'''') || '' '' ||
        COALESCE(v.eventdatetime,'''') || '' '' ||
        COALESCE(v.taskstatus,'''') || '' '' ||
        COALESCE(v.msgtype,'''')
    ) LIKE LOWER(''%'' || TRIM(:searchtext) || ''%'')
)

ORDER BY v.edatetime DESC
--ax_pagination', 'filter,uname,searchtext', 'filter~Character~,uname~Character~,searchtext~Character~', 'ALL', NULL, 'Application', 0, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>

<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1968550000003, 'F', 0, NULL, 'admin', '2026-02-20', 'admin', '2025-10-07', NULL, 1, 1, NULL, NULL, NULL, 'TASKPLANNER', NULL, 'SELECT 
    th.taskid,th.taskname,
    th.duedate,
    TO_CHAR(
        COALESCE(tp.newdate, th.scheduleddate),
        ''DD/MM/YYYY''
    ) AS scheduleddate,
    th.taskdescription,
    th.estimateddays,
    th.status,th.assignby,th.tagpeople,c1.customername,p1.companyname,
    th.taskf_hdrid
FROM taskf_hdr th
LEFT JOIN cusdt1 c1 ON c1.cusdt1id = th.customer
LEFT JOIN partnerdetails p1 ON p1.partnerdetailsid = th.partner
left JOIN tasku1 tp 
    ON tp.taskid = th.taskid 
   AND tp.username = :uname
WHERE th.status NOT IN (''Closed'',''Completed'',''Dropped'')
  AND (th.lastactionto = :uname
       OR (th.lastactionto IS NULL AND th.assignto = :uname))
  AND (
        tp.taskid IS NOT NULL  
        OR NOT EXISTS (
            SELECT 1 FROM tasku1 tpx 
            WHERE tpx.taskid = th.taskid AND tpx.username = :uname
        )  
      )
ORDER BY th.assigneddate desc', 'uname', 'uname~Character~', 'ALL', NULL, 'Application', 5, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>


<<
INSERT INTO axdirectsql
(axdirectsqlid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, sqlname, ddldatatype, sqltext, paramcal, sqlparams, accessstring, groupname, sqlsrc, sqlsrccnd, sqlquerycols, cachedata, cacheinterval, encryptedflds, adsdesc, smartlistcnd)
VALUES(1350010000006, 'F', 0, NULL, 'admin', '2025-12-05', 'admin', '2025-12-05', NULL, 1, 1, NULL, NULL, NULL, 'RECORDAFTERSAVE', NULL, 'select t.tasku1id from tasku1 t where t.taskid=:taskid', 'taskid', 'taskid~Character~', 'ALL', NULL, 'Application', 5, NULL, 'F', '6 Hr', NULL, NULL, NULL);
>>



<<
Create Table taskusers(taskid varchar(100),usern varchar(100));
>>

<<
Create Table period(periodalues varchar(40));
>>

<<
create table taskplan(taskid varchar(20),username varchar(20),scheduleddate date);
>>


<<
CREATE OR REPLACE FUNCTION fn_inbox_search(p_user text, p_search text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (
        SELECT json_build_object(
            'data',
            COALESCE(json_agg(row_to_json(t)), '[]'::json)
        )
        FROM (
           
                SELECT 
    COALESCE(inbox.taskid, '') AS taskid,
    COALESCE(inbox.taskname, '') AS taskname,
    COALESCE(inbox.touser, '') AS touser,
    COALESCE(inbox.msgtype, '') AS msgtype,
    COALESCE(inbox.taskstatus, '') AS taskstatus,
    inbox.edatetime
            FROM (
              
                SELECT 
                    t.taskid::text,
                    t.taskname::text,
                    t.assignto::text AS touser,
                    'Task'::text AS msgtype,
                    t.status::text AS taskstatus,
                    t.modifiedon::timestamp AS edatetime   
                FROM taskf_hdr t
                WHERE t.assignto = p_user

                UNION ALL

                SELECT 
                    t.taskid::text,
                    t.taskname::text,
                    t.assignto::text,
                    'Task'::text,
                    t.status::text,
                    t.modifiedon::timestamp   
                FROM taskf_hdr t
                WHERE t.assignto IN (
                    SELECT e.shortname
                    FROM employee e
                    WHERE e.reportingto = p_user
                )

                UNION ALL

                SELECT 
                    v.taskid::text,
                    v.taskname::text,
                    v.touser::text,
                    v.msgtype::text,
                    v.taskstatus::text,
                    TO_TIMESTAMP(v.eventdatetime, 'DD/MM/YYYY HH24:MI:SS')  
                FROM vw_axpertinbox v
                WHERE v.touser = p_user

            ) inbox
            WHERE inbox.taskid IS NOT NULL
              AND (
                    p_search IS NULL OR TRIM(p_search) = ''
                    OR LOWER(inbox.taskid) LIKE LOWER('%' || TRIM(p_search) || '%')
                    OR LOWER(inbox.taskname) LIKE LOWER('%' || TRIM(p_search) || '%')
                )
            ORDER BY inbox.edatetime DESC
        ) t
    );
END;
$function$
;
>>



<<
CREATE OR REPLACE FUNCTION get_last_date(period text, td text DEFAULT NULL::text)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
BEGIN
    CASE 
        WHEN period = 'Today' THEN
            RETURN CURRENT_DATE;
        WHEN period = 'This week' THEN
            RETURN (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days')::DATE;
        WHEN period = 'Last week' THEN
            RETURN (DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' + INTERVAL '6 days')::DATE;
        WHEN period = 'This Month' THEN
            RETURN (DATE_TRUNC('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH' - INTERVAL '1 day')::DATE;
        WHEN period = 'Last Month' THEN
            RETURN (DATE_TRUNC('MONTH', CURRENT_DATE) - INTERVAL '1 day')::DATE;
        WHEN period = 'This year' THEN
            RETURN (DATE_TRUNC('YEAR', CURRENT_DATE) + INTERVAL '1 YEAR' - INTERVAL '1 day')::DATE;
        WHEN period = 'Last quarter' THEN
            RETURN (DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '1 day')::DATE;
        WHEN period = 'This quarter' THEN
            RETURN (DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months' - INTERVAL '1 day')::DATE;
        WHEN period = 'Custom' THEN
            RETURN TO_DATE(td, 'DD/MM/YYYY');
        ELSE
            RAISE EXCEPTION 'Invalid period value: %', period;
    END CASE;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr_from_close()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_cnt INT;
BEGIN
 PERFORM set_config('app.source_trigger', TG_NAME, true);
    -- Update taskf_hdr based on the new values from taskaccepthdr
    UPDATE taskf_hdr
    SET 
        lastaction = NEW.status,
        lastactionby = NEW.closedby,
        lastactiondate = NEW.taskclosedate,
        lastactionremarks=new.remarks,
lastactiontime=new.closetime
    WHERE taskid = NEW.taskid;
    -- Check if entry already exists in taskusers
    SELECT COUNT(1) INTO v_cnt
    FROM taskusers
   WHERE taskid = NEW.taskid AND usern = NEW.closedby;
    IF v_cnt = 0 THEN
        -- Insert into taskusers only if it does not exist
       INSERT INTO taskusers (taskid, usern)
       VALUES (NEW.taskid, NEW.closedby);
    END IF;
    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr_from_complete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_cnt INT;
BEGIN
 PERFORM set_config('app.source_trigger', TG_NAME, true);
    -- Update taskf_hdr based on the new values from taskaccepthdr
    UPDATE taskf_hdr
    SET 
        lastaction = NEW.status,
        lastactionby = NEW.completedby,
        lastactiondate = NEW.cdate,
        lastactionremarks=NEW.comments,
        lastactiontime=NEW.ctime
    WHERE taskid = NEW.taskid;
    -- Check if entry already exists in taskusers
    SELECT COUNT(1) INTO v_cnt
    FROM taskusers
    WHERE taskid = NEW.taskid AND usern = NEW.completedby;
    IF v_cnt = 0 THEN
        -- Insert into taskusers only if it does not exist
        INSERT INTO taskusers (taskid, usern)
        VALUES (NEW.taskid, NEW.completedby);
    END IF;
    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr_from_drop()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_cnt INT;
BEGIN
 PERFORM set_config('app.source_trigger', TG_NAME, true);
    -- Update taskf_hdr based on the new values from taskaccepthdr
    UPDATE taskf_hdr
    SET 
        lastaction = NEW.status,
        lastactionby = NEW.droppedby,
        lastactiondate = NEW.dropdate,
        lastactionremarks=NEW.reason,
lastactiontime=NEW.droptime
    WHERE taskid = NEW.taskid;
    -- Check if entry already exists in taskusers
    SELECT COUNT(1) INTO v_cnt
    FROM taskusers
   WHERE taskid = NEW.taskid AND usern = NEW.droppedby;
    IF v_cnt = 0 THEN
        -- Insert into taskusers only if it does not exist
       INSERT INTO taskusers (taskid, usern)
       VALUES (NEW.taskid, NEW.droppedby);
    END IF;
    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr_from_return()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_cnt INT;
BEGIN
 PERFORM set_config('app.source_trigger', TG_NAME, true);
    
    UPDATE taskf_hdr th
    SET 
        lastaction       = r.status,
        lastactionby     = r.returnby,
        lastactiondate   = r.returnedon,
        lastactionremarks= r.remarks,
        lastactiontime   = r.returntime,
        lastactionto     = r.returnto
    FROM (
        SELECT *
        FROM retun1
        WHERE taskid = NEW.taskid
        ORDER BY returnedon DESC, returntime DESC
        LIMIT 1
    ) r
    WHERE th.taskid = r.taskid;

    -- Check if entry already exists in taskusers
    SELECT COUNT(1) INTO v_cnt
    FROM taskusers
   WHERE taskid = NEW.taskid AND usern = NEW.returnby;
    IF v_cnt = 0 THEN
        -- Insert into taskusers only if it does not exist
       INSERT INTO taskusers (taskid, usern)
       VALUES (NEW.taskid, NEW.returnby);
    END IF;
    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr_from_delay()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_cnt INT;
BEGIN
 PERFORM set_config('app.source_trigger', TG_NAME, true);
    -- Update taskf_hdr based on the new values from taskaccepthdr
    UPDATE taskf_hdr
    SET 
        lastaction = NEW.status,
        lastactionby = NEW.rescheduledby,
        lastactiondate = NEW.rescheduledon,
        lastactionremarks=NEW.Reason,
       lastactiontime=new.rescheduledtime
    WHERE taskid = NEW.taskid;
    -- Check if entry already exists in taskusers
    SELECT COUNT(1) INTO v_cnt
    FROM taskusers
   WHERE taskid = NEW.taskid AND usern = NEW.rescheduledby;
    IF v_cnt = 0 THEN
        -- Insert into taskusers only if it does not exist
       INSERT INTO taskusers (taskid, usern)
       VALUES (NEW.taskid, NEW.rescheduledby);
    END IF;
    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr_from_send()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_cnt INT;
 latest RECORD;
BEGIN
 PERFORM set_config('app.source_trigger', TG_NAME, true);
    

SELECT *
    INTO latest
    FROM agilespace.tasksend_hdr
    WHERE taskid = NEW.taskid
    ORDER BY createdon DESC, senton DESC, senttime DESC
    LIMIT 1;

    UPDATE agilespace.taskf_hdr
    SET 
        lastaction        = COALESCE(latest.status, 'Forwarded'),
        lastactionby      = latest.forwardedby,
        lastactiondate    = latest.senton,
        lastactionremarks = latest.comments,
        lastactiontime    = latest.senttime,
        lastactionto      = latest.sendto
        WHERE taskid = latest.taskid;
   
    -- Check if entry already exists in taskusers
    SELECT COUNT(1) INTO v_cnt
    FROM agilespace.taskusers
   WHERE taskid = NEW.taskid AND usern = NEW.forwardedby;
    IF v_cnt = 0 THEN
        -- Insert into taskusers only if it does not exist
       INSERT INTO agilespace.taskusers (taskid, usern)
       VALUES (NEW.taskid, NEW.forwardedby);
    END IF;  
    RETURN NEW;
END;
$function$
;
>>


<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr_status_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_cnt INT;
BEGIN
 PERFORM set_config('app.source_trigger', TG_NAME, true);
    -- Update taskf_hdr based on the new values from taskaccepthdr
    UPDATE taskf_hdr
    SET 
        sttausupdateremarks=new.Remarks
    WHERE taskid = NEW.taskid;
    -- Check if entry already exists in taskusers
    SELECT COUNT(1) INTO v_cnt
    FROM taskusers
   WHERE taskid = NEW.taskid AND usern = NEW.pusername;
    IF v_cnt = 0 THEN
        -- Insert into taskusers only if it does not exist
       INSERT INTO taskusers (taskid, usern)
       VALUES (NEW.taskid, NEW.pusername);
    END IF;
    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION axp_sch_axgs000001()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin 
if tg_op='INSERT'  then 

insert  into axp_appsearch_data_v2 (hltype,structname,searchtext,params,docid) values('tstruct','Taskm',new.taskid,'~taskid='||new.taskid,'AXGS000001');

else if  tg_op='UPDATE'   then

insert  into axp_appsearch_data_v2 (hltype,structname,searchtext,params,docid) values('tstruct','Taskm',new.taskid,'~taskid='||new.taskid,'AXGS000001');

else  delete  FROM axp_appsearch_data_v2 where hltype='tstruct' and params='~taskid='||old.taskid;

 end if;

 end if;
return new;
exception

      when unique_violation then

UPDATE axp_appsearch_data_v2
        SET searchtext = NEW.taskid, params = '~taskid=' || NEW.taskid
        WHERE hltype = 'tstruct' AND docid = 'AXGS000001';

        RETURN NEW;
   when others then 

return new;

 end ;  
 $function$
;
>>


<<
CREATE OR REPLACE FUNCTION trg_manage_taskusers()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
-- Only set app.source_trigger if not already set
    IF current_setting('app.source_trigger', true) IS NULL THEN
        PERFORM set_config('app.source_trigger', TG_NAME, true);
    END IF;
    IF TG_OP = 'INSERT'  THEN
        -- Insert or update taskusers
        IF EXISTS (SELECT 1 FROM taskusers WHERE taskid = NEW.taskid) THEN
            UPDATE taskusers
            SET usern = NEW.lastactionby
            WHERE taskid = NEW.taskid;
        ELSE
            INSERT INTO taskusers (taskid, usern)
            VALUES (NEW.taskid, NEW.lastactionby);
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Delete corresponding record from taskusers
        DELETE FROM taskusers
        WHERE taskid = OLD.taskid;
    END IF;
 
    RETURN NULL; -- For AFTER triggers, result is ignored
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION get_last_date(period text, td text DEFAULT NULL::text)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
BEGIN
    CASE 
        WHEN period = 'Today' THEN
            RETURN CURRENT_DATE;
        WHEN period = 'This week' THEN
            RETURN (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days')::DATE;
        WHEN period = 'Last week' THEN
            RETURN (DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' + INTERVAL '6 days')::DATE;
        WHEN period = 'This Month' THEN
            RETURN (DATE_TRUNC('MONTH', CURRENT_DATE) + INTERVAL '1 MONTH' - INTERVAL '1 day')::DATE;
        WHEN period = 'Last Month' THEN
            RETURN (DATE_TRUNC('MONTH', CURRENT_DATE) - INTERVAL '1 day')::DATE;
        WHEN period = 'This year' THEN
            RETURN (DATE_TRUNC('YEAR', CURRENT_DATE) + INTERVAL '1 YEAR' - INTERVAL '1 day')::DATE;
        WHEN period = 'Last quarter' THEN
            RETURN (DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '1 day')::DATE;
        WHEN period = 'This quarter' THEN
            RETURN (DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months' - INTERVAL '1 day')::DATE;
        WHEN period = 'Custom' THEN
            RETURN TO_DATE(td, 'DD/MM/YYYY');
        ELSE
            RAISE EXCEPTION 'Invalid period value: %', period;
    END CASE;
END;
$function$
;
>>



<<
CREATE OR REPLACE FUNCTION fn_taskf_hdr_audit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_source_trigger TEXT;
BEGIN
    -- Get trigger context
    v_source_trigger := current_setting('app.source_trigger', true);


    -- Insert log row
    INSERT INTO agilespace.taskf_log (
        taskid, status, source_trigger, log_date, log_time, updated_by
    )
    VALUES (
        NEW.taskid,
        NEW.lastaction,
        COALESCE(v_source_trigger, TG_NAME),
        CURRENT_DATE,
        CURRENT_TIME,
        NEW.lastactionby
    );

    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_delete_tasku1()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if delete flag is set to 'T' (true)
    IF NEW.deletflg = 'T' THEN
        DELETE FROM tasku1
        WHERE taskid = NEW.taskid
          AND newdate = NEW.newdate; -- optional, to delete exact row if multiple dates exist
        RETURN NULL; -- returning null prevents the row from being updated
    ELSE
        RETURN NEW; -- allow other updates
    END IF;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION trg_update_taskf_hdr()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_maxdate DATE;
BEGIN
    -- Get the max newdate for this taskid
    SELECT MAX(newdate) INTO v_maxdate
    FROM tasku1
    WHERE taskid = NEW.taskid;

    -- This automatically sets scheduleddate to NULL if no rows exist
    UPDATE taskf_hdr
    SET scheduleddate = v_maxdate
    WHERE taskid = NEW.taskid;

    RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION fn_log_task_copy()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.moveflg = 'T' THEN
    -- Move action: remove the old date entry (if exists)
    DELETE FROM taskplan
    WHERE taskid = NEW.taskid
      AND username = NEW.username
      AND scheduleddate = NEW.fromdate;

    -- Then insert the new one
    INSERT INTO taskplan (taskid, username, scheduleddate)
    VALUES (NEW.taskid, NEW.username, NEW.newdate);

  ELSE
    -- Copy action: insert new record always
    INSERT INTO taskplan (taskid, username, scheduleddate)
    VALUES (NEW.taskid, NEW.username, NEW.newdate);
  END IF;

  RETURN NEW;
END;
$function$
;
>>

<<
CREATE OR REPLACE FUNCTION fn_update_emailto()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_manager text;
    v_list text[];
BEGIN
    -- Fetch reporting manager of the assignto user
    SELECT reportingto 
    INTO v_manager
    FROM axusers
    WHERE username = NEW.assignto;

    -- Build array including possible duplicates
    v_list := ARRAY[
                NULLIF(NEW.assignby, ''),
                NULLIF(NEW.tagpeople, ''),
                NULLIF(NEW.assignto, ''),
                NULLIF(v_manager, '')
              ];

    -- Remove NULLs and duplicates, then join back into CSV
    NEW.emailto := (
        SELECT string_agg(elem, ',' ORDER BY elem)
        FROM (
            SELECT DISTINCT elem
            FROM unnest(v_list) elem
            WHERE elem IS NOT NULL AND elem <> ''
        ) AS unique_list
    );

    RETURN NEW;
END;
$function$
;
>>

<<
create trigger trg_after_insert_update_close after
insert
    or
update
    on
    close1 for each row execute function trg_update_taskf_hdr_from_close()
>>

<<
create trigger trg_after_insert_update_taskcompletehdr after
insert
    or
update
    on
    complete_hdr for each row execute function trg_update_taskf_hdr_from_complete()
>>

<<
create trigger trg_after_insert_update_drop after
insert
    or
update
    on
    drop1 for each row execute function trg_update_taskf_hdr_from_drop()
>>

<<
create trigger trg_after_insert_update_return after
insert
    or
update
    on
    retun1 for each row execute function trg_update_taskf_hdr_from_return()
>>

<<
create trigger axp_sch_axgs000001 after
insert
    or
update
    on
    taskf_hdr for each row execute function axp_sch_axgs000001()
>>

<<
create trigger trg_manage_taskusers after
insert
    or
delete
    or
update
    on
    taskf_hdr for each row execute function trg_manage_taskusers()
>>

<<
create trigger trg_taskf_hdr_audit after
update
    on
    taskf_hdr for each row execute function fn_taskf_hdr_audit()
>>

<<
create trigger trg_after_insert_update_delay after
insert
    or
update
    on
    taskinformdelay_hdr for each row execute function trg_update_taskf_hdr_from_delay()

>>

<<
create trigger trg_after_insert_update_send after
insert
    or
update
    on
    tasksend_hdr for each row execute function trg_update_taskf_hdr_from_send()
>>

<<
create trigger trg_after_insert_update_status after
insert
    or
update
    on
    taskstatusupdate_hdr for each row execute function trg_update_taskf_hdr_status_update()
>>

<<
create trigger tasku1_delete_trigger before
update
    on
    tasku1 for each row
    when (((new.deletflg)::text = 'T'::text)) execute function trg_delete_tasku1()
>>

<<
create trigger tasku1_update_hdr_trigger after
delete
    or
update
    on
    tasku1 for each row execute function trg_update_taskf_hdr()
>>

<<
create trigger trg_tasku_log_copy after
insert
    on
    tasku1 for each row execute function fn_log_task_copy()
>>

<<
create trigger trg_update_emailto before
insert
    or
update
    of assignby,
    assignto,
    tagpeople on
    tasku1 for each row execute function fn_update_emailto();
>>


<<
CREATE OR REPLACE VIEW vw_axpertinbox
AS SELECT DISTINCT a.touser,
    a.processname,
    a.taskname,
    a.taskid,
    a.tasktype,
    a.eventdatetime AS edatetime,
    to_char(to_timestamp(a.eventdatetime::text, 'YYYYMMDDHH24MISSSSS'::text), 'dd/mm/yyyy hh24:mi:ss'::text) AS eventdatetime,
    a.fromuser,
    a.fromrole,
    a.displayicon,
    a.displaytitle,
    a.displaymcontent,
    a.displaycontent,
    a.displaybuttons,
    a.keyfield,
    a.keyvalue,
    a.transid,
    a.priorindex,
    a.indexno,
    a.subindexno,
    a.approvereasons,
    a.defapptext,
    a.returnreasons,
    a.defrettext,
    a.rejectreasons,
    a.defregtext,
    aa.recordid,
    a.approvalcomments,
    a.rejectcomments,
    a.returncomments,
    'PEG'::text AS rectype,
    'NA'::text AS msgtype,
    a.returnable,
    a.initiator,
    a.initiator_approval,
    a.displaysubtitle,
    p.amendment,
    a.allowsend,
    a.allowsendflg,
    b.cmsg_appcheck,
    b.cmsg_return,
    b.cmsg_reject,
    b.showbuttons,
    NULL::text AS hlink,
    NULL::text AS hlink_transid,
    NULL::text AS hlink_params,
    'Pending'::text AS taskstatus,
    NULL::text AS statusreason,
    NULL::text AS statustext,
    NULL::text AS cancelremarks,
    NULL::text AS cancelledby,
    NULL::text AS cancelledon,
    NULL::text AS cancel,
    NULL::text AS username,
    'Active'::text AS cstatus
   FROM axactivetasks a
     JOIN axprocessdefv2 b ON a.processname::text = b.processname::text AND a.taskname::text = b.taskname::text
     JOIN axpdef_peg_processmaster p ON a.processname::text = p.caption::text
     LEFT JOIN axactivetasks aa ON a.processname::text = aa.processname::text AND a.keyvalue::text = aa.keyvalue::text AND a.transid::text = aa.transid::text AND aa.tasktype::text = 'Make'::text AND aa.recordid IS NOT NULL
  WHERE NOT (EXISTS ( SELECT b_1.taskid
           FROM axactivetaskstatus b_1
          WHERE a.taskid::text = b_1.taskid::text)) AND a.removeflg::text = 'F'::text
UNION ALL
 SELECT a.touser,
    a.processname,
    a.taskname,
    a.taskid,
    a.tasktype,
    a.eventdatetime AS edatetime,
    to_char(to_timestamp(a.eventdatetime::text, 'YYYYMMDDHH24MISSSSS'::text), 'dd/mm/yyyy hh24:mi:ss'::text) AS eventdatetime,
    a.fromuser,
    a.fromrole,
    a.displayicon,
    a.displaytitle,
    a.displaymcontent,
    a.displaycontent,
    a.displaybuttons,
    a.keyfield,
    a.keyvalue,
    a.transid,
    a.priorindex,
    a.indexno,
    a.subindexno,
    a.approvereasons,
    a.defapptext,
    a.returnreasons,
    a.defrettext,
    a.rejectreasons,
    a.defregtext,
    a.recordid,
    a.approvalcomments,
    a.rejectcomments,
    a.returncomments,
    'PEG'::text AS rectype,
    'NA'::text AS msgtype,
    a.returnable,
    a.initiator,
    a.initiator_approval,
    a.displaysubtitle,
    NULL::character varying AS amendment,
    a.allowsend,
    a.allowsendflg,
    NULL::text AS cmsg_appcheck,
    NULL::text AS cmsg_return,
    NULL::text AS cmsg_reject,
    NULL::character varying AS showbuttons,
    NULL::text AS hlink,
    NULL::text AS hlink_transid,
    NULL::text AS hlink_params,
    pr_pegv2_transcurstatus(a.transid, a.keyvalue, a.processname) AS taskstatus,
    b.statusreason,
    b.statustext,
    b.cancelremarks,
    b.cancelledby,
    b.cancelledon::character varying AS cancelledon,
    b.cancel,
        CASE
            WHEN a.indexno = 1::numeric THEN a.fromuser
            ELSE a.touser
        END AS username,
    'Completed'::text AS cstatus
   FROM axactivetasks a
     JOIN axactivetaskstatus b ON a.taskid::text = b.taskid::text
UNION ALL
 SELECT axactivemessages.touser,
    axactivemessages.processname,
    axactivemessages.taskname,
    axactivemessages.taskid,
    axactivemessages.tasktype,
    axactivemessages.eventdatetime AS edatetime,
    to_char(to_timestamp(axactivemessages.eventdatetime::text, 'YYYYMMDDHH24MISSSSS'::text), 'dd/mm/yyyy hh24:mi:ss'::text) AS eventdatetime,
    axactivemessages.fromuser,
    NULL::character varying AS fromrole,
    axactivemessages.displayicon,
    axactivemessages.displaytitle,
    NULL::text AS displaymcontent,
    axactivemessages.displaycontent,
    NULL::character varying AS displaybuttons,
    axactivemessages.keyfield,
    axactivemessages.keyvalue,
    axactivemessages.transid,
    0 AS priorindex,
    axactivemessages.indexno,
    0 AS subindexno,
    NULL::character varying AS approvereasons,
    NULL::character varying AS defapptext,
    NULL::character varying AS returnreasons,
    NULL::character varying AS defrettext,
    NULL::character varying AS rejectreasons,
    NULL::character varying AS defregtext,
    0 AS recordid,
    NULL::character varying AS approvalcomments,
    NULL::character varying AS rejectcomments,
    NULL::character varying AS returncomments,
    'MSG'::text AS rectype,
    axactivemessages.msgtype,
    'F'::character varying AS returnable,
    NULL::character varying AS initiator,
    NULL::character varying AS initiator_approval,
    NULL::character varying AS displaysubtitle,
    p.amendment,
    'F'::character varying AS allowsend,
    'F'::character varying AS allowsendflg,
    NULL::text AS cmsg_appcheck,
    NULL::text AS cmsg_return,
    NULL::text AS cmsg_reject,
    NULL::character varying AS showbuttons,
    axactivemessages.hlink,
    axactivemessages.hlink_transid,
    axactivemessages.hlink_params,
    'Completed'::text AS taskstatus,
    NULL::text AS statusreason,
    NULL::text AS statustext,
    NULL::text AS cancelremarks,
    NULL::text AS cancelledby,
    NULL::text AS cancelledon,
    NULL::text AS cancel,
    NULL::text AS username,
    'Completed'::text AS cstatus
   FROM axactivemessages
     LEFT JOIN axpdef_peg_processmaster p ON axactivemessages.processname::text = p.caption::text
  WHERE NOT (EXISTS ( SELECT b.taskid
           FROM axactivetaskstatus b
          WHERE axactivemessages.taskid::text = b.taskid::text)) AND (axactivemessages.transid::text <> ALL (ARRAY['tassk'::character varying::text, 'ticke'::character varying::text, 'send'::character varying::text, 'retun'::character varying::text, 'taskc'::character varying::text, 'close'::character varying::text, 'drop'::character varying::text, 'infor'::character varying::text, 'stupd'::character varying::text, 'Taskm'::character varying::text]))
UNION ALL
 SELECT axactivemessages.touser,
    axactivemessages.processname,
    axactivemessages.taskname,
    axactivemessages.taskid,
    axactivemessages.tasktype,
    axactivemessages.eventdatetime AS edatetime,
    to_char(to_timestamp(axactivemessages.eventdatetime::text, 'YYYYMMDDHH24MISSSSS'::text), 'dd/mm/yyyy hh24:mi:ss'::text) AS eventdatetime,
    axactivemessages.fromuser,
    NULL::character varying AS fromrole,
    axactivemessages.displayicon,
    axactivemessages.displaytitle,
    NULL::text AS displaymcontent,
    axactivemessages.displaycontent,
    NULL::character varying AS displaybuttons,
    axactivemessages.keyfield,
    axactivemessages.keyvalue,
    axactivemessages.transid,
    0 AS priorindex,
    axactivemessages.indexno,
    0 AS subindexno,
    NULL::character varying AS approvereasons,
    NULL::character varying AS defapptext,
    NULL::character varying AS returnreasons,
    NULL::character varying AS defrettext,
    NULL::character varying AS rejectreasons,
    NULL::character varying AS defregtext,
    0 AS recordid,
    NULL::character varying AS approvalcomments,
    NULL::character varying AS rejectcomments,
    NULL::character varying AS returncomments,
    'MSG'::text AS rectype,
        CASE
            WHEN axactivemessages.transid::text = 'tassk'::text THEN 'Task'::text
            WHEN axactivemessages.transid::text = ANY (ARRAY['ticke'::text, 'send'::text, 'retun'::text, 'taskc'::text, 'close'::text, 'drop'::text, 'infor'::text, 'stupd'::text, 'Taskm'::text]) THEN 'Ticket'::text
            ELSE NULL::text
        END AS msgtype,
    'F'::character varying AS returnable,
    NULL::character varying AS initiator,
    NULL::character varying AS initiator_approval,
    NULL::character varying AS displaysubtitle,
    'F'::character varying AS amendment,
    'F'::character varying AS allowsend,
    'F'::character varying AS allowsendflg,
    NULL::text AS cmsg_appcheck,
    NULL::text AS cmsg_return,
    NULL::text AS cmsg_reject,
    NULL::character varying AS showbuttons,
    axactivemessages.hlink,
    axactivemessages.hlink_transid,
    axactivemessages.hlink_params,
        CASE axactivemessages.transid
            WHEN 'tassk'::text THEN 'Task Assigned'::text
            WHEN 'Taskm'::text THEN 'Ticket Raised'::text
            WHEN 'send'::text THEN 'Forwarded'::text
            WHEN 'retun'::text THEN 'Returned'::text
            WHEN 'taskc'::text THEN 'Completed'::text
            WHEN 'close'::text THEN 'Closed'::text
            WHEN 'drop'::text THEN 'Dropped'::text
            WHEN 'infor'::text THEN 'Informed Delay'::text
            WHEN 'stupd'::text THEN 'Status Updated'::text
            ELSE NULL::text
        END AS taskstatus,
    NULL::text AS statusreason,
    NULL::text AS statustext,
    NULL::text AS cancelremarks,
    NULL::text AS cancelledby,
    NULL::text AS cancelledon,
    NULL::text AS cancel,
    NULL::text AS username,
    'Completed'::text AS cstatus
   FROM axactivemessages
  WHERE axactivemessages.transid::text = ANY (ARRAY['tassk'::character varying::text, 'ticke'::character varying::text, 'send'::character varying::text, 'retun'::character varying::text, 'taskc'::character varying::text, 'close'::character varying::text, 'drop'::character varying::text, 'infor'::character varying::text, 'stupd'::character varying::text, 'Taskm'::character varying::text]);
>>

