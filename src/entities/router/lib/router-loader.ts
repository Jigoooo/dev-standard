import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { getMenuMemberAuthApi } from '@/entities/router/api/router-api.ts';
import { Router } from '@/entities/router';

export async function routerLoader(args: LoaderFunctionArgs) {
  const menuId = args.request.url.split('/').pop();

  if (!menuId) {
    return redirect(Router.SIGN_IN);
  }

  const menuAuthResponse = await getMenuMemberAuthApi({
    menuId,
  });

  // console.log(menuAuthResponse);

  return '';
}
