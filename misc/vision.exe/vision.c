/* --- The following code comes from C:\Code\lcc\lib\wizard\textmode.tpl. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>

#define PROGNAME = 'Vision'

int main(int argc,char *argv[])
{
    printf("Vision coming up...\n");
  	system("server\\bin\\ruby.exe vision.rb");
	return 0;
}
