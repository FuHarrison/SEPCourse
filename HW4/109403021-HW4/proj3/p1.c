#include <stdio.h>
#include "awk_sem.h"

main() {
    int i = 0 ;
    // *** Please insert proper semaphore initialization here
    int semid1, semid2, semid3;
    semid1 = create_sem(".", "P1", 1);
    semid2 = create_sem(".", "P2", 0);
    semid3 = create_sem(".", "P3", 0);

    do {
        // *** this is where you should place semaphore 
        P(semid1);
       
       printf("P1111111111 is here\n"); i++;
       
       // *** this is where you should place semaphore
       V(semid2);
        P(semid1);
                
    }  while (i < 100) ;
}