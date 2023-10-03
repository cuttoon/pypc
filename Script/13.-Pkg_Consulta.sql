create or replace PACKAGE PG_SAI_CONSULTA IS
    TYPE ccursor IS REF CURSOR;
PROCEDURE PA_SAI_TEMAS(c_temas OUT SYS_REFCURSOR);
PROCEDURE PA_SAI_TIPO_TEMAS(c_tipo_temas OUT SYS_REFCURSOR);
PROCEDURE PA_SAI_ODS(c_ods OUT SYS_REFCURSOR);
PROCEDURE PA_SAI_DECLARACION_MOSCU(c_moscu OUT SYS_REFCURSOR);
PROCEDURE PA_SAI_AMBITO(c_ambito OUT SYS_REFCURSOR);
PROCEDURE PA_SAI_PAIS(c_pais OUT SYS_REFCURSOR);

PROCEDURE PA_SAI_GENERIC_SELECT_EXECUTE(sql_stmt VARCHAR2,c_events OUT SYS_REFCURSOR);

PROCEDURE PA_SAI_USUARIOS(c_users OUT SYS_REFCURSOR);

PROCEDURE PA_SAI_AUDITORIA(c_auditoria OUT SYS_REFCURSOR);

PROCEDURE PAI_SAI_INSERT_AUDITORIA(
  categoria  INT      ,
 ffin       DATE     ,
 fini       DATE     ,
  ids        IN OUT INTEGER ,
 imagen     VARCHAR2 ,
 objetivo   VARCHAR2,
 resumen    VARCHAR2,
 tipo       INT      ,
titulo     VARCHAR2 
);

PROCEDURE PAI_SAI_UPDATE_AUDITORIA(
  categoria  INT      ,
 ffin       DATE     ,
 fini       DATE     ,
  ids        IN OUT INTEGER ,
 imagen     VARCHAR2 ,
 objetivo   VARCHAR2,
 resumen    VARCHAR2,
 tipo       INT      ,
titulo     VARCHAR2 
);


PROCEDURE PA_SAI_INSERT_USUARIO(
        apellido VARCHAR2,
        correo VARCHAR2, 
        sexo char,
        ids IN OUT INTEGER,
        nombre VARCHAR2,
        pais int,
        clave VARCHAR2,
        rol INT        
        );

PROCEDURE PA_SAI_UPDATE_USUARIO(
        apellido VARCHAR2,
        correo VARCHAR2, 
        sexo char,
        ids IN OUT INTEGER,
        nombre VARCHAR2,
        pais int,
        clave VARCHAR2,
        rol INT        
    );

END PG_SAI_CONSULTA;
/
create or replace PACKAGE BODY      PG_SAI_CONSULTA AS
 
PROCEDURE PA_SAI_GENERIC_SELECT_EXECUTE(sql_stmt VARCHAR2,c_events OUT SYS_REFCURSOR) AS 
BEGIN     
    open c_events for sql_stmt;
END;


PROCEDURE PA_SAI_PAIS(c_pais OUT SYS_REFCURSOR)AS
BEGIN
       OPEN c_pais FOR
       SELECT ID , COUNTRY_NAME  AS DESCRIPTION
         FROM SAI_PAIS
        ORDER BY ID;
END;

PROCEDURE PA_SAI_AMBITO(c_ambito OUT SYS_REFCURSOR)AS
BEGIN
       OPEN c_ambito FOR
       SELECT ID , GROUP_NAME  AS DESCRIPTION
         FROM SAI_AMBITO
        ORDER BY ID;
END;

PROCEDURE PA_SAI_DECLARACION_MOSCU(c_moscu OUT SYS_REFCURSOR)AS
BEGIN
       OPEN c_moscu FOR
       SELECT ID , DECLARATION_NAME  AS DESCRIPTION
         FROM SAI_DECLARACION_MOSCU
        ORDER BY ID;
END;

PROCEDURE PA_SAI_ODS(c_ods OUT SYS_REFCURSOR)AS
BEGIN
       OPEN c_ods FOR
       SELECT ID , ODS_NAME  AS DESCRIPTION
         FROM SAI_ODS
        ORDER BY ID;
END;


PROCEDURE PA_SAI_TIPO_TEMAS(c_tipo_temas OUT SYS_REFCURSOR)AS
BEGIN
       OPEN c_tipo_temas FOR
       SELECT ID , TYPE_REPORT_NAME  AS DESCRIPTION
         FROM SAI_TIPO_AUDITORIA
        ORDER BY TYPE_REPORT_NAME;
END;

PROCEDURE PA_SAI_TEMAS(c_temas OUT SYS_REFCURSOR)AS
BEGIN
       OPEN c_temas FOR
       SELECT ID  , CATEGORY_NAME AS DESCRIPTION
         FROM SAI_CATEGORIA
        WHERE CATEGORY_STATUS=1
        ORDER BY CATEGORY_NAME;
END;

PROCEDURE PA_SAI_USUARIOS(c_users OUT SYS_REFCURSOR) AS
    BEGIN
        OPEN c_users FOR
         SELECT 
                U.ID USUARIO_ID,
                U.FIRST_NAME NOMBRE,
                U.LAST_NAME APELLIDO,
                U.EMAIL EMAIL,
                U.LAST_LOGIN LAST_LOGIN,
                U.NUM_LOGIN LOGINGS,
                U.IS_ACTIVE IS_ACTIVE,
                R.SLUG ROL,
                U.GENERO GENERO,
                P.ID PAIS_ID,
                P.SAI_NAME PAIS
                FROM SAI_USUARIOS U
                LEFT JOIN SAI_ROLES R ON R.ID = U.ROL_ID
                LEFT JOIN SAI_EFS P ON P.ID= U.PAIS_ID
                ORDER BY U.ID;   


    END;
    
PROCEDURE PA_SAI_AUDITORIA(c_auditoria OUT SYS_REFCURSOR) AS
    BEGIN
        OPEN c_auditoria FOR
            SELECT 
                A.ID REPORT_ID,
                A.REPORT_TITLE,
                A.RERPOR_OBJETIVE,
                A.REPORT_ABSTRACT,
                A.CATEGORY_ID,
                C.CATEGORY_NAME,
                A.TYPE_REPORT_ID,
                T.TYPE_REPORT_NAME,
                A.REPORT_SCOPE_START,
                A.REPORT_SCOPE_END,
                A.REPORT_IMAGE
                FROM sai_auditoria A
                LEFT JOIN SAI_CATEGORIA C ON C.ID = A.CATEGORY_ID
                LEFT JOIN SAI_TIPO_AUDITORIA T ON T.ID= A.TYPE_REPORT_ID
                ORDER BY A.ID;   


    END;


PROCEDURE PAI_SAI_INSERT_AUDITORIA(
    categoria  INT      ,
 ffin       DATE     ,
 fini       DATE     ,
  ids        IN OUT INTEGER ,
 imagen     VARCHAR2 ,
 objetivo   VARCHAR2,
 resumen    VARCHAR2,
 tipo       INT      ,
titulo     VARCHAR2 
)AS
BEGIN
        INSERT INTO SAI_AUDITORIA(   ID              ,     REPORT_TITLE     ,   RERPOR_OBJETIVE  ,
                                     REPORT_ABSTRACT ,     CATEGORY_ID      ,   TYPE_REPORT_ID   ,
                                     REPORT_SCOPE_START,   REPORT_SCOPE_END ,   
                                     REPORT_IMAGE     ,
                                     CREATED_AT       )
                        VALUES  (ids      , titulo     , objetivo   , resumen    , categoria        ,
                                 tipo     , fini       , ffin       ,
                                 imagen     , SYSDATE)
        RETURNING ID INTO ids;
        COMMIT;
END;

PROCEDURE PAI_SAI_UPDATE_AUDITORIA(
   categoria  INT      ,
 ffin       DATE     ,
 fini       DATE     ,
  ids        IN OUT INTEGER ,
 imagen     VARCHAR2 ,
 objetivo   VARCHAR2,
 resumen    VARCHAR2,
 tipo       INT      ,
titulo     VARCHAR2  
)AS
BEGIN
        UPDATE SAI_AUDITORIA
            SET
                REPORT_TITLE=titulo,
                RERPOR_OBJETIVE=objetivo,
                REPORT_ABSTRACT=resumen,
                CATEGORY_ID=categoria,
                TYPE_REPORT_ID=tipo,
                REPORT_SCOPE_START=fini,
                REPORT_SCOPE_END=ffin,
                REPORT_IMAGE=imagen,
                UPDATED_AT=SYSTIMESTAMP
            WHERE ID = ids
            RETURNING ID INTO  ids;
        COMMIT;
END;


PROCEDURE PA_SAI_INSERT_USUARIO(
        apellido VARCHAR2,
        correo VARCHAR2, 
        sexo char,
        ids IN OUT INTEGER,
        nombre VARCHAR2,
        pais int,
        clave VARCHAR2,
        rol INT        
        ) AS 
    BEGIN     

        Insert into SAI_USUARIOS 
        (
            ID,EMAIL,FIRST_NAME,LAST_NAME,PASSWORD,NUM_LOGIN,CREATED_AT, is_active,ROL_ID, GENERO,PAIS_ID
        ) 
        values (
            ids,correo,nombre,apellido,clave,0,SYSTIMESTAMP,1,rol, sexo,pais
        )
        RETURNING ID INTO ids;
        --UPDATE SAI_USUARIOS SET NUSU_USER_CREATED = ids WHERE NUSU_ID= ids;
        COMMIT;
    END;


PROCEDURE PA_SAI_UPDATE_USUARIO(
        apellido VARCHAR2,
        correo VARCHAR2, 
        sexo char,
        ids IN OUT INTEGER,
        nombre VARCHAR2,
        pais int,
        clave VARCHAR2,
        rol INT        
        ) AS 
    BEGIN     
        IF(clave is NULL) THEN

        UPDATE SAI_USUARIOS
            SET
                EMAIL=correo,
                FIRST_NAME=nombre,
                LAST_NAME=apellido,
                --password=password,
                --LAST_LOGIN=to_date(D_LAST_LOGIN,'DD/MM/YYYY'),
                NUM_LOGIN=NUM_LOGIN+1,
                ROL_ID=rol,
                GENERO=sexo,
                PAIS_ID=pais,
                UPDATED_AT=SYSTIMESTAMP
            WHERE ID = ids
            RETURNING ID INTO  ids;
        ELSE

           UPDATE SAI_USUARIOS
            SET
                EMAIL=correo,
                FIRST_NAME=nombre,
                LAST_NAME=apellido,
                password=clave,
                --LAST_LOGIN=to_date(D_LAST_LOGIN,'DD/MM/YYYY'),
                NUM_LOGIN=NUM_LOGIN+1,
                ROL_ID=rol,
                GENERO=sexo,
                PAIS_ID=pais,
                UPDATED_AT=SYSTIMESTAMP
            WHERE ID = ids
            RETURNING ID INTO  ids;

        END IF;


        COMMIT;
    END;



END PG_SAI_CONSULTA;