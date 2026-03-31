<<
delete from axi_command_prompts where cmdtoken=4 and wordpos=2;
>>

<<
delete from axi_command_prompts where cmdtoken=4 and wordpos=3;
>>

<<
INSERT INTO axi_command_prompts
(id, cmdtoken, wordpos, prompt, promptsource, promptparams, promptvalues, props, extraparams, requesturl)
VALUES('10655119-ba93-42e8-8aef-0aefccae5a80'::uuid, 4, 2, 'object type', '', NULL, 'Peg,Formnotification,Schedulednotification,Pegformnotification,Job,Rule,Properties,Permission,Access,Server,Keyfield,NewsAndAnnouncement,Settings,User,Users,Role,Roles,PublishAPI,PublishAPIListing,PublishListing,Cards,Responsibilities,UserGroup,Dimensions,Actors,UserActivation,UserPermissionListing,UserPermissions', NULL, NULL, NULL);
>>

<<
INSERT INTO axi_command_prompts
(id, cmdtoken, wordpos, prompt, promptsource, promptparams, promptvalues, props, extraparams, requesturl)
VALUES('0f99d918-0caa-4523-9260-f18b5bd162bf'::uuid, 4, 3, 'object name', 'Axi_PegList,Axi_FormNotifyList,Axi_ScheduleNotifyList,Axi_PEGNotifyList,Axi_JobNamesList,Axi_RuleNamesList,Axi_Dummy,axi_userlist,axi_rolelist,Axi_ServernameList,axi_structlist,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,Axi_Dummy,axi_userlist,axi_userlist', NULL, '', NULL, ':userresp,:mode,:structtype', NULL);
>>