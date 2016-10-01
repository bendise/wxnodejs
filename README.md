# wxnodejs
nodejs连接oracle的代码

其中文件夹“库存查询nodejs版_win7”是在win7环境下编译的，适用于win7操作系统，“库存查询nodejs版_win2008ser”是在win2008ser下编译的，适用于win2008ser操作系统,有任何问题可到我的博客交流 www.forevernodejs.cn

官方安装说明https://community.oracle.com/docs/DOC-931127

Installing node-oracledb on Microsoft Windows
 
Bill Christo
 
In this article Bill Christo (bchr02) leads you step-by-step though the process of installing node-oracledb on Microsoft Windows. Bill is an experienced corporate solutions provider and full-stack developer. He has been using the node-oracledb driver since it was released. He has contributed to it, and has guided many users through the process of installation on Windows.
 
 
I. Introduction
 
Node.js has revolutionized the web development industry by facilitating the use of the JavaScript programming language for server-side development. This also brings with it JavaScript’s non-blocking architecture, which permits commands to be executed in parallel in a single thread, allowing for the construction of highly concurrent applications. Before Node.js, developers were forced to use other languages such as PHP or ASP on the server-side, in addition to using JavaScript on the client-side. Having the ability for a more unified API opens the doors for increased efficiency and the potential of code sharing between the client and server.
 
Many companies have realized how advantageous Node.js is and so they are doing what they can to support it. One of the most recent companies to do this is Oracle Corp. with their release of node-oracledb, an Oracle database driver for Node.js. Node-oracledb is an open source project being actively maintained by Oracle on GitHub at the following URL: https://github.com/oracle/node-oracledb
 
In this article, we will cover what is needed to get node-oracledb installed and working on Microsoft Windows. This article is geared to those who have an Oracle database in their environment and those who are familiar with using Node.js and the npm package manager. If you are not yet familiar with them you should first familiarize yourself before proceeding. There are many websites to help you get started. One such website is nodeschool.io.
 
 
II. Before You Begin
 
Before you begin the installation, there are several factors to consider. First, you need to know the bitness of your Windows Operating System. Is it 32-bit or 64-bit? If 32-bit, you must use 32-bit software throughout the rest of the process. If 64-bit, you have the option of either. What’s important is that you remain consistent with the same bitness for all the software that is required. Mismatched usage of 32-bit and 64-bit software won’t work and instead would give ambiguous error messages during node-oracledb’s compilation.
 
In this article we will be using Visual Studio Community 2013 and Oracle Instant Client 12c, however, if you plan to use another version of either package, you need to verify that they are compatible with one another. For example, you cannot use Visual Studio 2008 with Oracle Database Client 12c because Oracle Database Client 12c does not contain the necessary files to compile with that version of Visual Studio. You would instead have to use Oracle Instant Client 11g. But, how would you know that? You would know that by reading the Client Quick Installation Guide for that version of Oracle, which clearly specify the supported compilers.
 
As an example, if we pull up the Oracle Instant Client 12.1 Quick Installation Guide for x64 Windows, under Section 3 we can see that version 2013 of Visual Studio is compatible.
 
1.jpg
 
By the way, you shouldn’t have any issues using a newer Oracle client from the Oracle database you are connecting to so long as it’s not too much older. For example, connecting to a 10gR2 database from a 12c client has never caused any issues for me. If you have a valid Oracle Support ID you can see Metalink Note 207303.1 for more information on backwards compatibility.
 
 
III. Install the Prerequisites
 
a. Visual Studio 2013 Community Edition
 
Before we can install node-oracledb we will need to install the prerequisites. We will start by installing Visual Studio 2013 Community Edition. At the time of this article, this can be downloaded from the Downloads section of the Visual Studio website here: https://www.visualstudio.com/downloads.
 
1.  Once at the site, scroll down until you see “Visual Studio 2013” and once found, click on it. This will bring you to the following page: 
2.jpg
 
2.  Next, you will want to click on “Download” to download the Visual Studio Community 2013 with Update 5 web installer.
 
3.  Once downloaded, run it.

4.  At the first screen of the installation, you have the option to change the install location. Click Next.
 
5.  At the next screen, you will need to agree to the licensing terms.
 
6.  At the optional features screen, you can safely uncheck each of them because none of them are necessary to proceed. Finally, click “Install”.
3.jpg
 
7. The installation time usually takes at least 20 minutes but can easily take much longer depending on your download speeds and what dependencies it finds that it needs to install for your specific system. Once the installation finishes you can just click the “x” on the top right to close it.
 
4.jpg
 
 
b. Python 2.7
 
Next, we need to install Python from the Python.org website’s Python 2.7 Download page.
 
      Here is a direct link: https://www.python.org/downloads/release/python-2710/
 
1.  Once at the page, you will want to either download the file named “Windows x86-64 MSI installer” or “Windows x86 MSI installer” depending on whether you are doing a 32-bit or 64-bit installation. The file marked x86-64 is for 64-bit installations. Once you have downloaded the file run it. On the first screen of the installation you will be asked whether you want to install for for all users or not. You can leave this set to the default and click “Next”.
5.jpg
 
  2. On the second screen you will be asked for the destination directory. You can leave this set to the default and click “Next”.
6.jpg
 
3.  On the third screen of the installation you will be asked to customize the installation. At this screen it’s important that you scroll down to where it says “Add python.exe to Path” and select to include it with the installation. Then click “Next”. Once the installation finishes click “Finish”.
7.jpg
 
 
c. Node.js
 
The next prerequisite to install is a compatible version of Node.js. Be sure to check node-oracle’s README.md for a currently supported version. In this article I will be using version 0.12.7, which is available from one of the following two links.
 
For 32-bit: https://nodejs.org/dist/v0.12.7/node-v0.12.7-x86.msi
 
For 64-bit: https://nodejs.org/dist/v0.12.7/x64/node-v0.12.7-x64.msi
 
1.  Once the msi installer is downloaded run it.
 
2.  At the first screen of the installation, click “Next”.
8.jpg
 
3.  Accept the licensing agreement and click “Next”.
  9.jpg
 
4.  Choose the installation directory or leave at the default location, then click “Next”
10.jpg
 
5.  At the Custom Setup page, be sure that “Add to Path” is selected, then click “Next”. And then at the “Ready to install” page click “Install”.
11.jpg
 
 
d. Oracle Instant Client Downloads
 
Next, we will download the necessary Oracle Client files from the following URL: http://www.oracle.com/technetwork/database/features/instant-client/index-097480.html
 
1.  Once at the Oracle Instant Client Downloads page, for 64-bit installations click “Instant Client for Microsoft Windows (x64)” or for 32-bit choose “Instant Client for Microsoft Windows (32-bit)”. 
12.jpg
 
2.  At the top of the next page you will first need to accept the license agreement. Then click to download each of the following two files:
Instant Client Package – Basic
Instant Client Package – SDK
 
You will need a free Oracle Account to download the above two files. (If you don’t have one, create one and then go back to download.)
 
3.  Once the two zip files are downloaded, we need to extract them. Right click on the first zip file and choose “Extract All” then click “Extract”. Do the same for the second zip file. Once both are extracted, create a new folder named “Oracle” on the root directory. Then within that folder, create another folder named “instantclient”. Now we need to copy the contents of each of the extracted folder’s sub folder into this new folder. After you do this, c:\Oracle\instantclient should look something like this:
 
13.jpg
 
 
IV. Set Environment Variables
 
The last steps we will need to do before we can install node-oracledb is to add the dynamic link libraries (DLLs), the ones we copied to c:\Oracle\instantclient, to the PATH environment variable and make sure they appear first. You should always make sure they appear first in the event you have another Oracle folder already in PATH, from perhaps an old install. The DLLs that node-oracledb finds first are the ones that it uses. Also we need to add the OCI_LIB_DIR and OCI_INC_DIR environment variables. These are only required during the installation of node-oracledb so that it can compile.
 
1.  Open the System window by ONE of the following two methods:
Using your mouse, click on the “Start Menu” then right click “Computer” and choose “Properties”.
On your keyboard press Win + Pause/Break
 
2.  Click on “Advanced system settings” which is located on the left side of the window. This will bring up the System Properties dialog box.
 
3.  Click on the Environment Variables button.
 
4. Once at the Environment Variables window, you will want to search the System Variables list (located on the bottom half of the window) for Path. Once found click on it and then click “Edit”.
 
5.  Add “C:\Oracle\instantclient;” to the beginning of the Variable value field (as shown below).
14.jpg
6.  Click “OK” to save.
 
7.  Next, under the System variable sections, click “New”.
 
8.  Add “OCI_LIB_DIR” as the variable name.
 
9.  Add “C:\Oracle\instantclient\sdk\lib\msvc” as the variable value.
 
15.jpg
 
10.  Click “OK” to save.
 
11.  Next, under the System variable sections, click “New”
 
12.  Add “OCI_INC_DIR” as the variable name.
 
13.  Add “C:\Oracle\instantclient\sdk\include” as the variable value.
 
16.jpg
 
14.  Click “OK” to save.
 
15.  Click “OK” on the following two windows to finish saving and closing the dialog boxes.
 
 
V. Install node-oracledb
 
Now we are finally ready to install the module.
 
Create a folder where your node app will reside.
Open a new command prompt and navigate to this folder. (Make sure that you don’t use an existing command prompt that was open before you set and updated the environment variables because they won’t be available to it.)
Type: npm install oracledb
TIP: If you are sitting behind a firewall you may need to configure npm to route your requests through a proxy using the following command:
npm config set https-proxy http://www.example.com:80/
 
If successful, your results should look similar to the below:
 
17.jpg
 
 
 
VI. Test
 
To test that oracledb is working, copy the below code in a new file named app.js, which you are to save within the node app directory created in the last section.
// app.js  
  
var oracledb = require('oracledb');  
  
oracledb.getConnection({  
     user: "hr",  
     password: "welcome",  
     connectString: "localhost/xe"  
}, function(err, connection) {  
     if (err) {  
          console.error(err.message);  
          return;  
     }  
     connection.execute( "SELECT department_id, department_name FROM departments WHERE department_id = 180",  
     [],  
     function(err, result) {  
          if (err) {  
               console.error(err.message);  
               doRelease(connection);  
               return;  
          }  
          console.log(result.metaData);  
          console.log(result.rows);  
          doRelease(connection);  
     });  
});  
  
function doRelease(connection) {  
     connection.release(  
          function(err) {  
               if (err) {console.error(err.message);}  
          }  
     );  
}  
 
Now modify the user, password, connectString, and query to match your environment. However, if you have unlocked and set the password for the HR sample account... for example:
ALTER USER HR ACCOUNT UNLOCK IDENTIFIED BY welcome;  
...and would like to test using the Oracle supplied sample database, then you only need to change the password and possibly the connectString (if your database resides on another computer).
 
After having saved the above code to a file named app.js within the node app directory created in the last section, we can run it.
 
open a command prompt and navigate to app directory
type node app.js
 
If successful, you should now have the results of the query displayed in your command prompt as JSON. If you have used the HR sample database you results should look like this:
 
18.jpg
 
 
VII. Copying Binaries Between Windows Machines
 
Now that we installed and tested node-oracledb, you might find it useful to know that you could copy the install to another computer. This saves you the trouble of needing to install Visual Studios and Python on the destination computer.
 
Instructions
 
Both computers must have the same version and architecture of Node.js.
 
Both computers must have the same version and architecture of the Oracle Client Libraries (Instant Client Package – Basic). The same instructions from Section III. d. can be used. The SDK (Instant Client Package – SDK) is not needed but it wouldn’t hurt to have it in the event you later decided to install a build environment.
 
The Oracle Client Libraries must be in the destination computer's PATH environment variable. The same instructions as in Section IV. can be used.
 
On the source computer after node-oracle has been built, copy the node_modules\oracledb directory to the destination computer's node_module directory.
 
If you used Oracle Client 11.2 then the Visual Studio 2005 restributable is required. For Oracle Client 12.1, use the Visual Studio 2010 redistributable. Also, be sure to use the same architecture as the Oracle Client Libraries that you have installed.
 
It should be mentioned that while copying the installation may be useful for quickly setting up a development computer, I do not recommend it for a production deployment. The reason is because using this method does not allow the destination computer to upgrade node-oracledb when newer versions come out. Additionally, upgrading to a newer version of Node.js could break the node-oracledb installation. For security reasons, production deployments should try to have the most up to date Node.js installed.
 
 
VIII. Conclusion
 
In this article I have shown you how to install node-oracledb for Node.js on Microsoft Windows. Within Node.js, using only JavaScript, we have set up an environment that can connect and interface with an Oracle database. I have also shown you how easy it is to copy and use the binaries on another computer. From here, with npm (node package manager) you could install another module, such as Express (https://www.npmjs.com/package/express) or LoopBack (https://github.com/strongloop/loopback/), and build single page applications, websites or HTTP API’s. The possibilities are endless!
 
 
About the Author
 
Bill Christo (bchr02) is an experienced corporate solutions provider and full-stack developer. For over a decade he has worked as the IT Manager for several small aerospace based businesses in South Florida. Bill is passionate in creating technological efficiencies that allows companies to become more successful through the use of better processes and tools. He is also passionate about Information Security. Bill holds a Bachelor of Science in Information Technology from Western Governors University. He also holds the following Certifications: Microsoft Certified Systems Administrator, CompTIA Linux+, CompTIA Security+, CompTIA Project+, Sun Certified Java Associate, CIW JavaScript Specialist, CIW Web Design Specialist, and CIW Professional. https://www.linkedin.com/in/billchristo or https://twitter.com/bchr02
