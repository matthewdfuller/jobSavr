function addJob() {
    document.getElementById('add_job_outer_box').style.display="block";
    var visible = true;
}

/*
function monitorClick(e){
        var evt = (e)?e:event;
       
        var theElem = (evt.srcElement)?evt.srcElement:evt.target;

        while(theElem!=null) {
            if(visible==true && theElem.id != "add_job_outer_box") {
               document.getElementById('add_job_outer_box').style.display == 'none';
                visible = false;
                return true;
            }  
        }
        }
        
        return true;
}

document.onclick = monitorClick;

*/