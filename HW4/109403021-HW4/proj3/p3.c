#include <stdio.h>
#include "awk_sem.h"

main() {
    int i = 0 ;
    // *** please insert proper semaphore initialization here
    int semid1, semid2, semid3;
    semid1 = get_sem(".", "P1");
    semid2 = get_sem(".", "P2");
    semid3 = get_sem(".", "P3");


    do {
        // *** this is where you should place semaphore 
        P(semid3);
       
       printf("P3333333 is here\n"); i++ ;
       
       // *** this is where you should place semaphore
       V(semid1);
   
    }  while (i< 200);
}